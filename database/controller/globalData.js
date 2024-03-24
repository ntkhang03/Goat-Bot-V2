const { existsSync, writeJsonSync, readJSONSync } = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");
const _ = require("lodash");
const { CustomError, TaskQueue, getType } = global.utils;

const optionsWriteJSON = {
	spaces: 2,
	EOL: "\n"
};

const messageQueue = new TaskQueue(function (task, callback) {
	if (getType(task) === "AsyncFunction") {
		task()
			.then(result => callback(null, result))
			.catch(err => callback(err));
	}
	else {
		try {
			const result = task();
			callback(null, result);
		}
		catch (err) {
			callback(err);
		}
	}
});

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
		try {
			const index = _.findIndex(global.db.allGlobalData, { key });
			if (index === -1 && mode === "update") {
				throw new CustomError({
					name: "KEY_NOT_FOUND",
					message: `Can't find data with key: "${key}" in database`
				});
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
							return _.cloneDeep(dataCreated);
						}
						case "json": {
							const timeCreate = moment.tz().format();
							data.createdAt = timeCreate;
							data.updatedAt = timeCreate;
							global.db.allGlobalData.push(data);
							writeJsonSync(pathGlobalData, global.db.allGlobalData, optionsWriteJSON);
							return _.cloneDeep(data);
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
							return _.cloneDeep(dataUpdated);
						}
						case "sqlite": {
							const getData = await globalModel.findOne({ where: { key } });
							const dataUpdated = (await getData.update(dataWillChange)).get({ plain: true });
							global.db.allGlobalData[index] = dataUpdated;
							return _.cloneDeep(dataUpdated);
						}
						case "json": {
							dataWillChange.updatedAt = moment.tz().format();
							global.db.allGlobalData[index] = {
								...oldGlobalData,
								...dataWillChange
							};
							writeJsonSync(pathGlobalData, global.db.allGlobalData, optionsWriteJSON);
							return _.cloneDeep(global.db.allGlobalData[index]);
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
			return null;
		}
		catch (err) {
			throw err;
		}
	}

	async function create_(key, data) {
		return new Promise(async (resolve, reject) => {
			if (typeof key != "string") {
				const err = new Error(`The first argument (key) must be a string, not a ${typeof key}`);
				err.name = "INVALID_TYPE";
				return reject(err);
			}
			if (data == undefined) {
				const err = new Error(`The second argument (data) must be not undefined`);
				err.name = "INVALID_TYPE";
				return reject(err);
			}

			data = {
				key,
				...data
			};

			if (!data.hasOwnProperty("data")) {
				const err = new Error(`The data must have a property "data"`);
				err.name = "INVALID_TYPE";
				return reject(err);
			}

			if (Object.keys(data).some(key => !['key', 'data'].includes(key))) {
				const err = new Error(`The second argument (data) must be an object with keys is "key" and "data"`);
				err.name = "INVALID_TYPE";
				return reject(err);
			}

			const findInCreatingData = creatingGlobalData.find(u => u.key == key);
			if (findInCreatingData)
				return resolve(findInCreatingData.promise);

			const queue = new Promise(async function (resolve_, reject_) {
				try {
					if (global.db.allGlobalData.some(u => u.key == key)) {
						throw new CustomError({
							name: "KEY_EXISTS",
							message: `Data with key "${key}" already exists in the data`
						});
					}

					data.key = key;
					const createData = await save(key, data, "create");
					resolve_(_.cloneDeep(createData));
				}
				catch (err) {
					reject_(err);
				}
				const findIndex = creatingGlobalData.findIndex(u => u.key == key);
				if (findIndex != -1)
					creatingGlobalData.splice(findIndex, 1);
			});
			creatingGlobalData.push({
				key,
				promise: queue
			});
			return resolve(queue);
		});
	}


	async function create(key, data) {
		return new Promise((resolve, reject) => {
			messageQueue.push(function () {
				create_(key, data)
					.then(resolve)
					.catch(reject);
			});
		});
	}

	function getAll(path, defaultValue, query) {
		return new Promise(async function (resolve, reject) {
			messageQueue.push(async function () {
				try {
					let dataReturn = _.cloneDeep(global.db.allGlobalData);

					if (query)
						if (typeof query !== "string")
							throw new CustomError({
								name: "INVALID_QUERY",
								message: `The third argument (query) must be a string, not a ${typeof query}`
							});
						else
							dataReturn = dataReturn.map(uData => fakeGraphql(query, uData));

					if (path)
						if (!["string", "object"].includes(typeof path))
							throw new CustomError({
								name: "INVALID_PATH",
								message: `The first argument (path) must be a string or an array, not a ${typeof path}`
							});
						else
							if (typeof path === "string")
								return resolve(_.cloneDeep(dataReturn.map(uData => _.get(uData, path, defaultValue))));
							else
								return resolve(_.cloneDeep(dataReturn.map(uData => _.times(path.length, i => _.get(uData, path[i], defaultValue[i])))));

					return resolve(_.cloneDeep(dataReturn));
				}
				catch (err) {
					reject(err);
				}
			});
		});
	}

	async function get_(key, path, defaultValue, query) {
		if (!key || typeof key != "string")
			throw new CustomError({
				name: "INVALID_KEY",
				message: `The first argument (key) must be a string, not a ${typeof key}`
			});

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

				dataReturn = await create_(key, createData);
			}
			else
				return undefined;
		}

		if (query)
			if (typeof query !== "string")
				throw new CustomError({
					name: "INVALID_QUERY",
					message: `The fourth argument (query) must be a string, not a ${typeof query}`
				});
			else
				dataReturn = fakeGraphql(query, dataReturn);

		if (path)
			if (!["string", "array"].includes(typeof path))
				throw new CustomError({
					name: "INVALID_PATH",
					message: `The second argument (path) must be a string or an array, not a ${typeof path}`
				});
			else
				if (typeof path === "string")
					return _.cloneDeep(_.get(dataReturn, path, defaultValue));
				else
					return _.cloneDeep(_.times(path.length, i => _.get(dataReturn, path[i], defaultValue[i])));

		return _.cloneDeep(dataReturn);
	}

	async function get(key, path, defaultValue, query) {
		return new Promise((resolve, reject) => {
			messageQueue.push(function () {
				get_(key, path, defaultValue, query)
					.then(resolve)
					.catch(reject);
			});
		});
	}

	async function set(key, updateData, path, query) {
		return new Promise((resolve, reject) => {
			messageQueue.push(async function () {
				try {
					if (!path && (typeof updateData != "object" || typeof updateData == "object" && Array.isArray(updateData)))
						throw new CustomError({
							name: "INVALID_UPDATE_DATA",
							message: `The second argument (updateData) must be an object, not a ${typeof updateData}`
						});
					if (!global.db.allGlobalData.some(u => u.key == key)) {
						throw new CustomError({
							name: "KEY_NOT_FOUND",
							message: `Data with key "${key}" does not exist in the data`
						});
					}
					const setData = await save(key, updateData, "update", path);
					if (query)
						if (typeof query !== "string")
							throw new CustomError({
								name: "INVALID_QUERY",
								message: `The fourth argument (query) must be a string, not a ${typeof query}`
							});
						else
							return resolve(_.cloneDeep(fakeGraphql(query, setData)));
					return resolve(_.cloneDeep(setData));
				}
				catch (err) {
					reject(err);
				}
			});
		});
	}

	async function deleteKey(key, path, query) {
		return new Promise((resolve, reject) => {
			messageQueue.push(async function () {
				try {
					if (typeof key != "string") {
						throw new CustomError({
							name: "INVALID_KEY",
							message: `The first argument (key) must be a string, not a ${typeof key}`
						});
					}
					if (!global.db.allGlobalData.some(u => u.key == key)) {
						throw new CustomError({
							name: "KEY_NOT_FOUND",
							message: `Data with key "${key}" does not exist in the data`
						});
					}

					if (typeof path !== "string")
						throw new CustomError({
							name: "INVALID_PATH",
							message: `The second argument (path) must be a string, not a ${typeof path}`
						});
					const spitPath = path.split(".");
					if (spitPath.length == 1)
						throw new CustomError({
							name: "INVALID_PATH",
							message: `Can't delete key "${path}" because it's a root key`
						});
					const parent = spitPath.slice(0, spitPath.length - 1).join(".");
					const parentData = await get_(key, parent);
					if (!parentData)
						throw new CustomError({
							name: "KEY_NOT_FOUND",
							message: `Can't find key "${parent}" in user data`
						});

					_.unset(parentData, spitPath[spitPath.length - 1]);
					const setData = await save(key, parentData, "update", parent);
					if (query)
						if (typeof query !== "string")
							throw new CustomError({
								name: "INVALID_QUERY",
								message: `The fourth argument (query) must be a string, not a ${typeof query}`
							});
						else
							return resolve(_.cloneDeep(fakeGraphql(query, setData)));
					return resolve(_.cloneDeep(setData));
				}
				catch (err) {
					reject(err);
				}
			});
		});
	}

	async function remove(key) {
		return new Promise((resolve, reject) => {
			messageQueue.push(async function () {
				try {
					if (typeof key != "string") {
						throw new CustomError({
							name: "INVALID_KEY",
							message: `The first argument (key) must be a string, not a ${typeof key}`
						});
					}
					await save(key, { key }, "remove");
					return resolve(true);
				}
				catch (err) {
					reject(err);
				}
			});
		});
	}

	return {
		existsSync: function existsSync(key) {
			return global.db.allGlobalData.some(u => u.key == key);
		},
		create,
		getAll,
		get,
		set,
		deleteKey,
		remove
	};
};