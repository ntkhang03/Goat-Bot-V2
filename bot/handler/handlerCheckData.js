const { db, utils, GoatBot } = global;
const { config } = GoatBot;
const { log, getText } = utils;

const { creatingThreadData, creatingUserData } = global.client.database;

module.exports = async function (usersData, threadsData, event) {
	const { threadID, isGroup } = event;
	const senderID = event.senderID || event.author || event.userID;

	// ———————————— CHECK THREAD DATA ———————————— //
	if (threadID && isGroup && !db.allThreadData.some(t => t.threadID == threadID)) {
		try {
			if (global.temp.createThreadDataError.includes(threadID))
				return;

			const findInCreatingThreadData = creatingThreadData.find(t => t.threadID == threadID);
			if (!findInCreatingThreadData) {
				const threadData = await threadsData.create(threadID);
				log.info("DATABASE", `New Thread: ${threadID} | ${threadData.threadName} | ${config.database.type}`);
			}
			else {
				await findInCreatingThreadData.promise;
			}
		}
		catch (err) {
			global.temp.createThreadDataError.push(threadID);
			log.err("DATABASE", getText("handlerCheckData", "cantCreateThread", threadID), err);
		}
	}


	// ————————————— CHECK USER DATA ————————————— //
	if (senderID && !db.allUserData.some(u => u.userID == senderID)) {
		try {
			const findInCreatingUserData = creatingUserData.find(u => u.userID == senderID);
			if (!findInCreatingUserData) {
				const userData = await usersData.create(senderID);
				log.info("DATABASE", `New User: ${senderID} | ${userData.name} | ${config.database.type}`);
			}
			else {
				await findInCreatingUserData.promise;
			}
		}
		catch (err) {
			log.err("DATABASE", getText("handlerCheckData", "cantCreateUser", senderID), err);
		}
	}
};