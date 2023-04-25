const { existsSync, writeJsonSync, readJSONSync } = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");

const _ = require("lodash");
const optionsWriteJSON = {
	spaces: 2,
	EOL: "\n"
};
const { creatingGlobalData } = global.client.database;

module.exports = async function (databaseType, globalModel, fakeGraphql) {
	let GlobalData = [];
	const pathGlobalData = path.join(__dirname, "..", "data/globalData.json");

	switch (databaseType) {
		case "mongodb":
			// delete keys '_id' and '__v' in all global data
			GlobalData = (await globalModel.find({}).lean()).map(item => _.omit(item, ["_id", "__v"]));
			break;
		case "sqlite":
			GlobalData = (await globalModel.findAll()).map(item => item.get({ plain: true }));
			break;
		case "json":
			if (!existsSync(pathGlobalData))
				writeJsonSync(pathGlobalData, [], optionsWriteJSON);
			GlobalData = readJSONSync(pathGlobalData);
			break;
	}
	global.db.allGlobalData = GlobalData;

	async function save(key, data, mode, path) {
		const index = _.findIndex(global.db.allGlobalData, { key });
		if (index === -1 && mode === "update") {
			const err = new Error(`Can't find data with key: "${key}" in database`);
			err.name = "KEY_NOT_FOUND";
			throw err;
		}

		switch (mode) {
			case "create": {
				switch (databaseType) {
					case "mongodb":
					case "sqlite": {
						let dataCreated = await globalModel.create(data);
						dataCreated = databaseType == "mongodb" ?
							_.omit(dataCreated._doc, ["_id", "__v"]) :
							dataCreated.get({ plain: true });
						global.db.allGlobalData.push(dataCreated);
						return dataCreated;
					}
					case "json": {
						const timeCreate = moment.tz().format();
						data.createdAt = timeCreate;
						data.updatedAt = timeCreate;
						global.db.allGlobalData.push(data);
						writeJsonSync(pathGlobalData, global.db.allGlobalData, optionsWriteJSON);
						return data;
					}
				}
				break;
			}
			case "update": {
				const oldGlobalData = global.db.allGlobalData[index];
				const dataWillChange = {};

				if (Array.isArray(path) && Array.isArray(data)) {
					path.forEach((p, index) => {
						const _key = p.split(".")[0];
						dataWillChange[_key] = oldGlobalData[_key];
						_.set(oldGlobalData, p, data[index]);
					});
				}
				else
					if (path && typeof path === "string" || Array.isArray(path)) {
						const _key = Array.isArray(path) ? path[0] : path.split(".")[0];
						dataWillChange[_key] = oldGlobalData[_key];
						_.set(dataWillChange, path, data);
					}
					else
						for (const key in data)
							dataWillChange[key] = data[key];

				switch (databaseType) {
					case "mongodb": {
						let dataUpdated = await globalModel.findOneAndUpdate({ key }, dataWillChange, { returnDocument: 'after' });
						dataUpdated = _.omit(dataUpdated._doc, ["_id", "__v"]);
						global.db.allGlobalData[index] = dataUpdated;
						return dataUpdated;
					}
					case "sqlite": {
						const getData = await globalModel.findOne({ where: { key } });
						const dataUpdated = (await getData.update(dataWillChange)).get({ plain: true });
						global.db.allGlobalData[index] = dataUpdated;
						return dataUpdated;
					}
					case "json": {
						dataWillChange.updatedAt = moment.tz().format();
						global.db.allGlobalData[index] = {
							...oldGlobalData,
							...dataWillChange
						};
						writeJsonSync(pathGlobalData, global.db.allGlobalData, optionsWriteJSON);
						return global.db.allGlobalData[index];
					}
				}
				break;
			}
			case "remove": {
				if (index != -1) {
					global.db.allGlobalData.splice(index, 1);
					if (databaseType == "mongodb")
						await globalModel.deleteOne({ key });
					else if (databaseType == "sqlite")
						await globalModel.destroy({ where: { key } });
					else
						writeJsonSync(pathGlobalData, global.db.allGlobalData, optionsWriteJSON);
				}
				break;
			}
		}
	}


	async function create(key, data) {
		if (typeof key != "string") {
			const err = new Error(`The first argument (key) must be a string, not a ${typeof key}`);
			err.name = "INVALID_TYPE";
			throw err;
		}
		if (data == undefined) {
			const err = new Error(`The second argument (data) must be not undefined`);
			err.name = "INVALID_TYPE";
			throw err;
		}

		data = {
			key,
			...data
		};

		if (!data.hasOwnProperty("data")) {
			const err = new Error(`The data must have a property "data"`);
			err.name = "INVALID_TYPE";
			throw err;
		}

		if (Object.keys(data).some(key => !['key', 'data'].includes(key))) {
			const err = new Error(`The second argument (data) must be an object with keys is "key" and "data"`);
			err.name = "INVALID_TYPE";
			throw err;
		}

		const findInCreatingData = creatingGlobalData.find(u => u.key == key);
		if (findInCreatingData)
			return findInCreatingData.data;

		const queue = new Promise(async function (resolve, reject) {
			try {
				if (global.db.allGlobalData.some(u => u.key == key)) {
					const messageError = new Error(`Data with key "${key}" already exists in the data`);
					messageError.name = "KEY_EXISTS";
					throw messageError;
				}

				data.key = key;
				const createData = await save(key, data, "create");
				resolve(createData);
			}
			catch (err) {
				reject(err);
			}
			const findIndex = creatingGlobalData.findIndex(u => u.key == key);
			if (findIndex != -1)
				creatingGlobalData.splice(findIndex, 1);
		});
		creatingGlobalData.push({
			key,
			data: queue
		});
		return queue;
	}


	function getAll(path, defaultValue, query) {
		try {
			let dataReturn = _.cloneDeep(global.db.allGlobalData);

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


	async function get(key, path, defaultValue, query) {
		try {
			if (!key || typeof key != "string")
				throw new Error(`The first argument (key) must be a string, not a ${typeof key}`);

			let dataReturn = global.db.allGlobalData.find(u => u.key == key);
			if (!dataReturn) {
				const createData = {};
				if (defaultValue) {
					if (path)
						if (!["string", "array"].includes(typeof path))
							throw new Error(`The second argument (path) must be a string or an array, not a ${typeof path}`);
						else
							if (typeof path === "string")
								_.set(createData, path, defaultValue);
							else
								_.times(path.length, i => _.set(createData, path[i], defaultValue[i]));
					else
						_.set(createData, "data", defaultValue);

					dataReturn = await create(key, createData);
				}
				else
					return undefined;
			}

			if (query)
				if (typeof query !== "string")
					throw new Error(`The fourth argument (query) must be a string, not a ${typeof query}`);
				else
					dataReturn = fakeGraphql(query, dataReturn);

			if (path)
				if (!["string", "array"].includes(typeof path))
					throw new Error(`The second argument (path) must be a string or an array, not a ${typeof path}`);
				else
					if (typeof path === "string")
						return _.get(dataReturn, path, defaultValue);
					else
						return _.times(path.length, i => _.get(dataReturn, path[i], defaultValue[i]));

			return dataReturn;
		}
		catch (err) {
			throw err;
		}
	}

	async function set(key, updateData, path, query) {
		try {
			if (!path && (typeof updateData != "object" || typeof updateData == "object" && Array.isArray(updateData)))
				throw new Error(`The second argument (updateData) must be an object, not a ${typeof updateData}`);
			if (!global.db.allGlobalData.some(u => u.key == key)) {
				const messageError = new Error(`Data with key "${key}" does not exist in the data`);
				messageError.name = "KEY_NOT_FOUND";
				throw messageError;
			}
			const setData = await save(key, updateData, "update", path);
			if (query)
				if (typeof query !== "string")
					throw new Error(`The fourth argument (query) must be a string, not a ${typeof query}`);
				else
					return fakeGraphql(query, setData);
			return setData;
		}
		catch (err) {
			throw err;
		}
	}


	async function remove(key) {
		try {
			if (typeof key != "string") {
				const error = new Error(`The first argument (key) must be a string, not a ${typeof key}`);
				error.name = "INVALID_KEY";
				throw error;
			}
			await save(key, { key }, "remove");
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