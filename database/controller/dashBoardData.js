const { existsSync, writeJsonSync, readJSONSync } = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");

const _ = require("lodash");
const optionsWriteJSON = {
	spaces: 2,
	EOL: "\n"
};
const { creatingDashBoardData } = global.client.database;

module.exports = async function (databaseType, dashBoardModel, fakeGraphql) {
	let Dashboard = [];
	const pathDashBoardData = path.join(__dirname, "..", "data/dashBoardData.json");

	switch (databaseType) {
		case "mongodb":
			// delete keys '_id' and '__v' in all dashboard data
			Dashboard = (await dashBoardModel.find({}).lean()).map(item => _.omit(item, ["_id", "__v"]));
			break;
		case "sqlite":
			Dashboard = (await dashBoardModel.findAll()).map(item => item.get({ plain: true }));
			break;
		case "json":
			if (!existsSync(pathDashBoardData))
				writeJsonSync(pathDashBoardData, [], optionsWriteJSON);
			Dashboard = readJSONSync(pathDashBoardData);
			break;
	}
	global.db.allDashBoardData = Dashboard;

	async function save(email, userData, mode, path) {
		const index = _.findIndex(global.db.allDashBoardData, { email });
		if (index === -1 && mode === "update") {
			const e = new Error(`Can't find user with email: ${email} in database`);
			e.name = "USER_NOT_FOUND";
			throw e;
		}

		switch (mode) {
			case "create": {
				switch (databaseType) {
					case "mongodb":
					case "sqlite": {
						const dataCreated = await dashBoardModel.create(userData);
						global.db.allDashBoardData.push(dataCreated);
						return databaseType == "mongodb" ?
							_.omit(dataCreated._doc, ["_id", "__v"]) :
							dataCreated.get({ plain: true });
					}
					case "json": {
						const timeCreate = moment.tz().format();
						userData.createdAt = timeCreate;
						userData.updatedAt = timeCreate;
						global.db.allDashBoardData.push(userData);
						writeJsonSync(pathDashBoardData, global.db.allDashBoardData, optionsWriteJSON);
						return userData;
					}
				}
				break;
			}
			case "update": {
				const oldUserData = global.db.allDashBoardData[index];
				const dataWillChange = {};

				if (Array.isArray(path) && Array.isArray(userData)) {
					path.forEach((p, index) => {
						const key = p.split(".")[0];
						dataWillChange[key] = oldUserData[key];
						_.set(dataWillChange, p, userData[index]);
					});
				}
				else
					if (path && typeof path === "string" || Array.isArray(path)) {
						const key = Array.isArray(path) ? path[0] : path.split(".")[0];
						dataWillChange[key] = oldUserData[key];
						_.set(dataWillChange, path, userData);
					}
					else
						for (const key in userData)
							dataWillChange[key] = userData[key];

				switch (databaseType) {
					case "mongodb": {
						let dataUpdated = await dashBoardModel.findOneAndUpdate({ email }, dataWillChange, { returnDocument: 'after' });
						dataUpdated = _.omit(dataUpdated._doc, ["_id", "__v"]);
						global.db.allDashBoardData[index] = dataUpdated;
						return dataUpdated;
					}
					case "sqlite": {
						const getData = await dashBoardModel.findOne({ where: { email } });
						const dataUpdated = (await getData.update(dataWillChange)).get({ plain: true });
						global.db.allDashBoardData[index] = dataUpdated;
						return dataUpdated;
					}
					case "json": {
						dataWillChange.updatedAt = moment.tz().format();
						global.db.allDashBoardData[index] = {
							...oldUserData,
							...dataWillChange
						};
						writeJsonSync(pathDashBoardData, global.db.allDashBoardData, optionsWriteJSON);
						return global.db.allDashBoardData[index];
					}
				}
				break;
			}
			case "remove": {
				if (index != -1) {
					global.db.allDashBoardData.splice(index, 1);
					if (databaseType == "mongodb")
						await dashBoardModel.deleteOne({ email });
					else if (databaseType == "sqlite")
						await dashBoardModel.destroy({ where: { email } });
					else
						writeJsonSync(pathDashBoardData, global.db.allDashBoardData, optionsWriteJSON);
				}
				break;
			}
		}
	}


	async function create(data) {
		if (typeof data != "object" || Array.isArray(data))
			throw new Error(`The first argument(data) must be an object, not a ${Array.isArray(data) ? "array" : typeof data}`);
		const email = data.email;
		const findInCreatingData = creatingDashBoardData.find(u => u.email == email);
		if (findInCreatingData)
			return findInCreatingData.data;

		const queue = new Promise(async function (resolve, reject) {
			try {
				if (global.db.allDashBoardData.some(u => u.email == email)) {
					const messageError = new Error(`User with email "${email}" already exists in the data`);
					messageError.name = "USER_ALREADY_EXISTS";
					throw messageError;
				}

				const userData = await save(email, data, "create");
				resolve(userData);
			}
			catch (err) {
				reject(err);
			}
			creatingDashBoardData.splice(creatingDashBoardData.findIndex(u => u.email == email), 1);
		});
		creatingDashBoardData.push({
			email,
			data: queue
		});
		return queue;
	}


	function getAll(path, defaultValue, query) {
		try {
			let dataReturn = _.cloneDeep(global.db.allDashBoardData);

			if (query)
				if (typeof query !== "string")
					throw new Error(`The third argument (query) must be a string, not a ${typeof query}`);
				else
					dataReturn = dataReturn.map(uData => fakeGraphql(query, uData));

			if (path)
				if (!["string", "object"].includes(typeof path))
					throw new Error(`The first argument (path) must be a string or an array, not a ${typeof path}`);
				else
					if (typeof path === "string")
						return dataReturn.map(uData => _.get(uData, path, defaultValue));
					else
						return dataReturn.map(uData => _.times(path.length, i => _.get(uData, path[i], defaultValue[i])));

			return dataReturn;
		}
		catch (err) {
			throw err;
		}
	}


	function get(email, path, defaultValue, query) {
		try {
			if (!email || typeof email != "string")
				throw new Error(`The first argument (email) must be a string, not a ${typeof email}`);
			let userData = global.db.allDashBoardData.find(u => u.email == email);
			if (!userData)
				return undefined;

			if (query)
				if (typeof query !== "string")
					throw new Error(`The fourth argument (query) must be a string, not a ${typeof query}`);
				else userData = fakeGraphql(query, userData);

			if (path)
				if (!["string", "array"].includes(typeof path))
					throw new Error(`The second argument (path) must be a string or an array, not a ${typeof path}`);
				else
					if (typeof path === "string")
						return _.get(userData, path, defaultValue);
					else
						return _.times(path.length, i => _.get(userData, path[i], defaultValue[i]));
			return userData;
		}
		catch (err) {
			throw err;
		}
	}

	async function set(email, updateData, path, query) {
		try {
			if (!path && (typeof updateData != "object" || typeof updateData == "object" && Array.isArray(updateData)))
				throw new Error(`The second argument (updateData) must be an object or an array, not a ${typeof updateData}`);
			if (!global.db.allDashBoardData.some(u => u.email == email)) {
				const messageError = new Error(`User with email "${email}" does not exist in the data`);
				messageError.name = "USER_NOT_FOUND";
				throw messageError;
			}
			const userData = await save(email, updateData, "update", path);
			if (query)
				if (typeof query !== "string")
					throw new Error(`The fourth argument (query) must be a string, not a ${typeof query}`);
				else
					return fakeGraphql(query, userData);
			return userData;
		}
		catch (err) {
			throw err;
		}
	}


	async function remove(email) {
		try {
			if (typeof threadID != "string") {
				const error = new Error(`The first argument (email) must be a string, not a ${typeof email}`);
				error.name = "INVALID_THREAD_ID";
				throw error;
			}
			await save(email, { email }, "remove");
			return true;
		}
		catch (err) {
			throw err;
		}
	}

	return {
		create,
		getAll,
		get,
		set,
		remove
	};
};