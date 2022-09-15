const { existsSync, writeJsonSync, readJSONSync } = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");
const axios = require("axios");
const _ = require("lodash");
const optionsWriteJSON = {
	spaces: 2,
	EOL: "\n"
};
const { creatingUserData } = global.client.database;

module.exports = async function (databaseType, userModel, api, fakeGraphql) {
	let Users = [];
	const pathUsersData = path.join(__dirname, "..", "data/usersData.json");

	switch (databaseType) {
		case "mongodb": {
			Users = await userModel.find();
			break;
		}
		case "sqlite": {
			Users = (await userModel.findAll()).map(u => u.get({ plain: true }));
			break;
		}
		case "json": {
			if (!existsSync(pathUsersData))
				writeJsonSync(pathUsersData, [], optionsWriteJSON);
			Users = readJSONSync(pathUsersData);
			break;
		}
	}
	global.db.allUserData = Users;

	async function save(userID, userData, mode, path) {
		let index = _.findIndex(Users, { userID });
		if (index === -1 && mode === "update") {
			try {
				await create(userID);
				index = Users.length - 1;
			}
			catch (err) {
				const e = new Error(`Can't find user with userID: ${userID} in database`);
				e.name = "UserNotExist";
				throw e;
			}
		}

		switch (mode) {
			case "create": {
				switch (databaseType) {
					case "mongodb":
					case "sqlite": {
						const dataCreated = await userModel.create(userData);
						Users.push(dataCreated);
						return databaseType == "mongodb" ? dataCreated : dataCreated.get({ plain: true });
					}
					case "json": {
						const timeCreate = moment.tz().format();
						userData.createdAt = timeCreate;
						userData.updatedAt = timeCreate;
						Users.push(userData);
						writeJsonSync(pathUsersData, Users, optionsWriteJSON);
						return userData;
					}
					default: {
						break;
					}
				}
				break;
			}
			case "update": {
				let dataWillChange = Users[index];

				if (Array.isArray(path) && Array.isArray(userData))
					dataWillChange = path.forEach((p, i) => _.set(dataWillChange, p, userData[i]));
				else
					dataWillChange = path ? _.set(dataWillChange, path, userData) : { ...dataWillChange, ...userData };

				switch (databaseType) {
					case "mongodb": {
						const dataUpdated = await userModel.updateOne({ userID }, dataWillChange);
						Users[index] = dataUpdated;
						return dataUpdated;
					}
					case "sqlite": {
						let dataUpdated = (await userModel.findOne({ where: { userID } })).update(dataWillChange);
						dataUpdated = dataUpdated.get({ plain: true });
						Users[index] = dataUpdated;
						return dataUpdated;
					}
					case "json": {
						dataWillChange.updatedAt = moment.tz().format();
						Users[index] = dataWillChange;
						writeJsonSync(pathUsersData, Users, optionsWriteJSON);
						return dataWillChange;
					}
				}
				break;
			}
			case "remove": {
				if (index != -1) {
					Users.splice(index, 1);
					switch (databaseType) {
						case "mongodb":
							await userModel.deleteOne({ userID });
							break;
						case "sqlite":
							await userModel.destroy({ where: { userID } });
							break;
						case "json":
							writeJsonSync(pathUsersData, Users, optionsWriteJSON);
							break;
					}
				}
				break;
			}
			default: {
				break;
			}
		}
	}

	async function getName(userID, checkData = true) {
		if (isNaN(userID)) {
			const error = new Error(`The "userID" argument must be of type number.`);
			error.name = "Invalid userID";
			throw error;
		}
		if (checkData) {
			const userData = Users.find(u => u.userID == userID);
			if (userData)
				return userData.name;
		}
		try {
			const user = await axios.post(`https://www.facebook.com/api/graphql/?q=${`node(${userID}){name}`}`);
			return user.data[userID].name;
		}
		catch (error) {
			return null;
		}
	}

	async function getAvatarUrl(userID) {
		if (isNaN(userID)) {
			const error = new Error(`The "userID" argument must be of type number.`);
			error.name = "Invalid userID";
			throw error;
		}
		try {
			const user = await axios.post(`https://www.facebook.com/api/graphql/`, null, {
				params: {
					doc_id: "5341536295888250",
					variables: JSON.stringify({ height: 500, scale: 1, userID, width: 500 })
				}
			});
			return user.data.data.profile.profile_picture.uri;
		}
		catch (err) {
			return null;
		}
	}

	async function create(userID, userInfo) {
		const findInCreatingData = creatingUserData.find(u => u.userID == userID);
		if (findInCreatingData)
			return findInCreatingData.data;

		const queue = new Promise(async function (resolve, reject) {
			try {
				if (Users.some(u => u.userID == userID)) {
					const messageError = new Error(`User with id "${userID}" already exists in the data`);
					messageError.name = "Data already exists";
					throw messageError;
				}
				if (isNaN(userID)) {
					const error = new Error(`The "userID" argument must be of type number.`);
					error.name = "Invalid userID";
					throw error;
				}
				userInfo = userInfo || (await api.getUserInfo(userID))[userID];
				let userData = {
					userID,
					name: userInfo.name,
					gender: userInfo.gender,
					vanity: userInfo.vanity,
					exp: 0,
					money: 0,
					banned: {},
					settings: {},
					data: {}
				};
				userData = await save(userID, userData, "create");
				resolve(userData);
			}
			catch (err) {
				reject(err);
			}
			creatingUserData.splice(creatingUserData.findIndex(u => u.userID == userID), 1);
		});
		creatingUserData.push({
			userID,
			data: queue
		});
		return queue;

	}

	async function refreshInfo(userID, updateInfoUser) {
		try {
			if (isNaN(userID)) {
				const error = new Error(`The "userID" argument must be of type number.`);
				error.name = "Invalid userID";
				throw error;
			}
			const infoUser = await get(userID);
			updateInfoUser = updateInfoUser || (await api.getUserInfo(userID))[userID];

			const newData = {
				name: updateInfoUser.name,
				vanity: updateInfoUser.vanity,
				gender: updateInfoUser.gender
			};
			let userData = {
				...infoUser,
				...newData
			};

			userData = await save(userID, userData, "update");
			return userData;
		}
		catch (err) {
			throw err;
		}
	}

	function getAll(path, defaultValue, query) {
		try {
			let dataReturn = _.cloneDeep(Users);

			if (query)
				if (typeof query !== "string")
					throw new Error(`The "query" argument must be of type string.`);
				else
					dataReturn = dataReturn.map(uData => fakeGraphql(query, uData));

			if (path)
				if (!["string", "object"].includes(typeof path))
					throw new Error(`The "path" argument must be of type string or array.`);
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

	async function get(userID, path, defaultValue, query) {
		try {
			if (isNaN(userID)) {
				const error = new Error(`The "userID" argument must be of type number.`);
				error.name = "Invalid userID";
				throw error;
			}
			let userData;

			const index = Users.findIndex(u => u.userID == userID);
			if (index === -1)
				userData = await create(userID);
			else
				userData = Users[index];

			if (query)
				if (typeof query !== "string")
					throw new Error(`The "query" argument must be of type string.`);
				else userData = fakeGraphql(query, userData);

			if (path)
				if (!["string", "array"].includes(typeof path))
					throw new Error(`The "path" argument must be of type string or array.`);
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


	async function set(userID, updateData, path, query) {
		try {
			if (isNaN(userID)) {
				const error = new Error(`The "userID" argument must be of type number.`);
				error.name = "Invalid userID";
				throw error;
			}
			if (!path && (typeof updateData != "object" || typeof updateData == "object" && Array.isArray(updateData)))
				throw new Error(`The "updateData" argument must be of type object.`);
			const userData = await save(userID, updateData, "update", path);
			if (query)
				if (typeof query !== "string")
					throw new Error(`The "query" argument must be of type string.`);
				else
					return fakeGraphql(query, userData);
			return userData;
		}
		catch (err) {
			throw err;
		}
	}

	async function remove(userID) {
		try {
			if (isNaN(userID)) {
				const error = new Error(`The "userID" argument must be of type number.`);
				error.name = "Invalid userID";
				throw error;
			}
			await save(userID, { userID }, "remove");
			return true;
		}
		catch (err) {
			throw err;
		}
	}

	return {
		getName,
		getAvatarUrl,
		create,
		refreshInfo,
		getAll,
		get,
		set,
		remove
	};
};