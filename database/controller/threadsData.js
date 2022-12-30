const { existsSync, writeJsonSync, readJSONSync } = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");

const _ = require("lodash");
const optionsWriteJSON = {
	spaces: 2,
	EOL: "\n"
};
const { creatingThreadData } = global.client.database;

module.exports = async function (databaseType, threadModel, api, fakeGraphql) {
	let Threads = [];
	const pathThreadsData = path.join(__dirname, "..", "data/threadsData.json");

	switch (databaseType) {
		case "mongodb": {
			// delete keys '_id' and '__v' in all threads
			Threads = (await threadModel.find({}).lean()).map(thread => _.omit(thread, ["_id", "__v"]));
			break;
		}
		case "sqlite": {
			Threads = (await threadModel.findAll()).map(thread => thread.get({ plain: true }));
			break;
		}
		case "json": {
			if (!existsSync(pathThreadsData))
				writeJsonSync(pathThreadsData, [], optionsWriteJSON);
			Threads = readJSONSync(pathThreadsData);
			break;
		}
	}

	global.db.allThreadData = Threads;

	async function save(threadID, threadData, mode, path) {
		let index = _.findIndex(global.db.allThreadData, { threadID });
		if (index === -1 && mode === "update") {
			try {
				await create(threadID);
				index = _.findIndex(global.db.allThreadData, { threadID });
			}
			catch (err) {
				const e = new Error(`Can't find thread with threadID: ${threadID} in database`);
				e.name = "ThreadNotExist";
				throw e;
			}
		}

		switch (mode) {
			case "create": {
				switch (databaseType) {
					case "mongodb":
					case "sqlite": {
						let dataCreated = await threadModel.create(threadData);
						dataCreated = databaseType == "mongodb" ?
							_.omit(dataCreated._doc, ["_id", "__v"]) :
							dataCreated.get({ plain: true });
						global.db.allThreadData.push(dataCreated);
						return dataCreated;
					}
					case "json": {
						const timeCreate = moment.tz().format();
						threadData.createdAt = timeCreate;
						threadData.updatedAt = timeCreate;
						global.db.allThreadData.push(threadData);
						writeJsonSync(pathThreadsData, global.db.allThreadData, optionsWriteJSON);
						return threadData;
					}
					default: {
						break;
					}
				}
				break;
			}
			case "update": {
				const oldThreadData = global.db.allThreadData[index];
				const dataWillChange = {};

				if (Array.isArray(path) && Array.isArray(threadData)) {
					path.forEach((p, index) => {
						const key = p.split(".")[0];
						dataWillChange[key] = oldThreadData[key];
						_.set(dataWillChange, p, threadData[index]);
					});
				}
				else
					if (path && typeof path === "string" || Array.isArray(path)) {
						const key = Array.isArray(path) ? path[0] : path.split(".")[0];
						dataWillChange[key] = oldThreadData[key];
						_.set(dataWillChange, path, threadData);
					}
					else
						for (const key in threadData)
							dataWillChange[key] = threadData[key];

				switch (databaseType) {
					case "mongodb": {
						let dataUpdated = await threadModel.findOneAndUpdate({ threadID }, dataWillChange, { returnDocument: 'after' });
						dataUpdated = _.omit(dataUpdated._doc, ["_id", "__v"]);
						global.db.allThreadData[index] = dataUpdated;
						return dataUpdated;
					}
					case "sqlite": {
						const thread = await threadModel.findOne({ where: { threadID } });
						const dataUpdated = (await thread.update(dataWillChange)).get({ plain: true });
						global.db.allThreadData[index] = dataUpdated;
						return dataUpdated;
					}
					case "json": {
						dataWillChange.updatedAt = moment.tz().format();
						global.db.allThreadData[index] = {
							...oldThreadData,
							...dataWillChange
						};
						writeJsonSync(pathThreadsData, global.db.allThreadData, optionsWriteJSON);
						return global.db.allThreadData[index];
					}
					default:
						break;
				}
				break;
			}
			case "delete": {
				if (index != -1) {
					global.db.allThreadData.splice(index, 1);
					switch (databaseType) {
						case "mongodb":
							await threadModel.deleteOne({ threadID });
							break;
						case "sqlite":
							await threadModel.destroy({ where: { threadID } });
							break;
						case "json":
							writeJsonSync(pathThreadsData, global.db.allThreadData, optionsWriteJSON);
							break;
						default:
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

	async function create(threadID, threadInfo) {
		const findInCreatingData = creatingThreadData.find(t => t.threadID == threadID);
		if (findInCreatingData)
			return findInCreatingData.data;

		const queue = new Promise(async function (resolve, reject) {
			try {
				if (global.db.allThreadData.some(t => t.threadID == threadID)) {
					const error = new Error(`Thread with id "${threadID}" already exists in the data`);
					error.name = "DATA_EXISTS";
					throw error;
				}
				if (isNaN(threadID)) {
					const error = new Error(`The first argument (threadID) must be a number, not a ${typeof threadID}`);
					error.name = "INVALID_THREAD_ID";
					throw error;
				}
				threadInfo = threadInfo || await api.getThreadInfo(threadID);
				const { threadName, userInfo, adminIDs } = threadInfo;
				const newAdminsIDs = adminIDs.reduce(function (_, b) {
					_.push(b.id);
					return _;
				}, []);

				const newMembers = userInfo.reduce(function (arr, user) {
					const userID = user.id;
					arr.push({
						userID,
						name: user.name,
						gender: user.gender,
						nickname: threadInfo.nicknames[userID] || null,
						inGroup: true,
						count: 0,
						permissionConfigDashboard: false
					});
					return arr;
				}, []);

				let threadData = {
					threadID,
					threadName,
					threadThemeID: threadInfo.threadTheme?.id || null,
					emoji: threadInfo.emoji,
					adminIDs: newAdminsIDs,
					imageSrc: threadInfo.imageSrc,
					approvalMode: threadInfo.approvalMode,
					members: newMembers,
					banned: {},
					settings: {
						sendWelcomeMessage: true,
						sendLeaveMessage: true,
						sendRankupMessage: false,
						customCommand: true
					},
					data: {},
					isGroup: threadInfo.threadType == 2
				};
				threadData = await save(threadID, threadData, "create");
				resolve(threadData);
			}
			catch (err) {
				reject(err);
			}
			creatingThreadData.splice(creatingThreadData.findIndex(t => t.threadID == threadID), 1);
		});
		creatingThreadData.push({
			threadID,
			data: queue
		});
		return queue;
	}

	async function refreshInfo(threadID, newThreadInfo) {
		try {
			if (isNaN(threadID)) {
				const error = new Error(`The first argument (threadID) must be a number, not a ${typeof threadID}`);
				error.name = "Invalid threadID";
				throw error;
			}
			const threadInfo = await get(threadID);
			newThreadInfo = newThreadInfo || await api.getThreadInfo(threadID);
			const { userInfo, adminIDs, nicknames } = newThreadInfo;
			let oldMembers = threadInfo.members;
			const newMembers = [];
			for (const user of userInfo) {
				const userID = user.id;
				const indexUser = _.findIndex(oldMembers, { userID });
				const oldDataUser = oldMembers[indexUser] || {};
				const data = {
					userID,
					...oldDataUser,
					name: user.name,
					gender: user.gender,
					nickname: nicknames[userID] || null,
					inGroup: true,
					count: oldDataUser.count || 0,
					permissionConfigDashboard: oldDataUser.permissionConfigDashboard || false
				};
				indexUser != -1 ? oldMembers[indexUser] = data : oldMembers.push(data);
				newMembers.push(oldMembers.splice(indexUser != -1 ? indexUser : oldMembers.length - 1, 1)[0]);
			}
			oldMembers = oldMembers.map(user => {
				user.inGroup = false;
				return user;
			});
			const newAdminsIDs = adminIDs.reduce(function (acc, cur) {
				acc.push(cur.id);
				return acc;
			}, []);
			let threadData = {
				...threadInfo,
				threadName: newThreadInfo.threadName,
				threadThemeID: newThreadInfo.threadTheme?.id || null,
				emoji: newThreadInfo.emoji,
				adminIDs: newAdminsIDs,
				imageSrc: newThreadInfo.imageSrc,
				members: [
					...oldMembers,
					...newMembers
				]
			};

			threadData = await save(threadID, threadData, "update");
			return threadData;
		}
		catch (err) {
			throw err;
		}
	}

	function getAll(path, defaultValue, query) {
		try {
			let dataReturn = _.cloneDeep(global.db.allThreadData);

			if (query)
				if (typeof query !== "string")
					throw new Error(`The third argument (query) must be a string, not a ${typeof query}`);
				else
					dataReturn = dataReturn.map(tData => fakeGraphql(query, tData));

			if (path)
				if (!["string", "object"].includes(typeof path))
					throw new Error(`The first argument (path) must be a string or an object, not a ${typeof path}`);
				else
					if (typeof path === "string")
						return dataReturn.map(tData => _.get(tData, path, defaultValue));
					else
						return dataReturn.map(tData => _.times(path.length, i => _.get(tData, path[i], defaultValue[i])));

			return dataReturn;
		}
		catch (err) {
			throw err;
		}
	}

	async function get(threadID, path, defaultValue, query) {
		try {
			if (isNaN(threadID)) {
				const error = new Error(`The first argument (threadID) must be a number, not a ${typeof threadID}`);
				error.name = "Invalid threadID";
				throw error;
			}
			let threadData;

			const index = global.db.allThreadData.findIndex(t => t.threadID == threadID);
			if (index === -1)
				threadData = await create(threadID);
			else
				threadData = global.db.allThreadData[index];

			if (query)
				if (typeof query != "string")
					throw new Error(`The fourth argument (query) must be a string, not a ${typeof query}`);
				else
					threadData = fakeGraphql(query, threadData);

			if (path)
				if (!["string", "object"].includes(typeof path))
					throw new Error(`The second argument (path) must be a string or an object, not a ${typeof path}`);
				else
					if (typeof path === "string")
						return _.get(threadData, path, defaultValue);
					else
						return _.times(path.length, i => _.get(threadData, path[i], defaultValue[i]));

			return threadData;
		}
		catch (err) {
			throw err;
		}
	}

	async function set(threadID, updateData, path, query) {
		try {
			if (isNaN(threadID)) {
				const error = new Error(`The first argument (threadID) must be a number, not a ${typeof threadID}`);
				error.name = "Invalid threadID";
				throw error;
			}
			if (!path && (typeof updateData != "object" || Array.isArray(updateData)))
				throw new Error(`The second argument (updateData) must be an object, not a ${typeof updateData}`);
			const threadData = await save(threadID, updateData, "update", path);
			if (query)
				if (typeof query !== "string")
					throw new Error(`The fourth argument (query) must be a string, not a ${typeof query}`);
				else
					return fakeGraphql(query, threadData);
			return threadData;
		}
		catch (err) {
			throw err;
		}
	}

	async function remove(threadID) {
		try {
			if (isNaN(threadID)) {
				const error = new Error(`The first argument (threadID) must be a number, not a ${typeof threadID}`);
				error.name = "INVALID_THREAD_ID";
				throw error;
			}
			await save(threadID, { threadID }, "delete");
			return true;
		}
		catch (err) {
			throw err;
		}
	}

	return {
		create,
		refreshInfo,
		getAll,
		get,
		set,
		remove
	};
};