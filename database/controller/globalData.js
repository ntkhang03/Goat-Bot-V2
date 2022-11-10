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
			GlobalData = await globalModel.find().lean();
			break;
		case "sqlite":
			GlobalData = (await globalModel.findAll()).map(u => u.get({ plain: true }));
			break;
		case "json":
			if (!existsSync(pathGlobalData))
				writeJsonSync(pathGlobalData, [], optionsWriteJSON);
			GlobalData = readJSONSync(pathGlobalData);
			break;
	}
	global.client.dashBoardData = GlobalData;

	async function save(key, data, mode, path) {
		const index = _.findIndex(GlobalData, { key });
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
						const dataCreated = await globalModel.create(data);
						GlobalData.push(dataCreated);
						return databaseType == "mongodb" ? dataCreated : dataCreated.get({ plain: true });
					}
					case "json": {
						const timeCreate = moment.tz().format();
						data.createdAt = timeCreate;
						data.updatedAt = timeCreate;
						GlobalData.push(data);
						writeJsonSync(pathGlobalData, GlobalData, optionsWriteJSON);
						return data;
					}
				}
				break;
			}
			case "update": {
				let dataWillChange = GlobalData[index];

				if (Array.isArray(path) && Array.isArray(data))
					dataWillChange = path.forEach((p, i) => _.set(dataWillChange, p, data[i]));
				else
					if (path)
						dataWillChange = _.set(dataWillChange, path, data);
					else
						for (const key in data)
							dataWillChange[key] = data[key];

				switch (databaseType) {
					case "mongodb": {
						const dataUpdated = await globalModel.findOneAndUpdate({ key }, dataWillChange, { returnDocument: 'after' });
						GlobalData[index] = dataUpdated;
						return dataUpdated;
					}
					case "sqlite": {
						const dataUpdated = (await (await globalModel.findOne({ where: { key } }))
							.update(dataWillChange))
							.get({ plain: true });
						GlobalData[index] = dataUpdated;
						return dataUpdated;
					}
					case "json": {
						dataWillChange.updatedAt = moment.tz().format();
						GlobalData[index] = dataWillChange;
						writeJsonSync(pathGlobalData, GlobalData, optionsWriteJSON);
						return dataWillChange;
					}
				}
				break;
			}
			case "remove": {
				if (index != -1) {
					GlobalData.splice(index, 1);
					if (databaseType == "mongodb")
						await globalModel.deleteOne({ key });
					else if (databaseType == "sqlite")
						await globalModel.destroy({ where: { key } });
					else
						writeJsonSync(pathGlobalData, GlobalData, optionsWriteJSON);
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
				if (GlobalData.some(u => u.key == key)) {
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
			let dataReturn = _.cloneDeep(GlobalData);

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


	function get(key, path, defaultValue, query) {
		try {
			if (!key || typeof key != "string")
				throw new Error(`The first argument (key) must be a string, not a ${typeof key}`);
			let dataReturn = GlobalData.find(u => u.key == key);
			if (!dataReturn)
				return undefined;

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
			if (!GlobalData.some(u => u.key == key)) {
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
			if (typeof threadID != "string") {
				const error = new Error(`The first argument (key) must be a string, not a ${typeof key}`);
				error.name = "INVALID_THREAD_ID";
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