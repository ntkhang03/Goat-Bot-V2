const { db, utils, GoatBot } = global;
const { config } = GoatBot;
const { log, getText } = utils;

module.exports = async function (usersData, threadsData, event) {
	const { threadID, isGroup } = event;
	const senderID = event.senderID || event.author || event.userID;
	// ———————————— CHECK THREAD DATA ———————————— //
	if (threadID && !db.allThreadData.some(t => t.threadID == threadID) && isGroup) {
		try {
			if (global.temp.createThreadDataError.includes(threadID))
				return;
			const threadData = await threadsData.create(threadID);
			log.info("DATABASE", `New Thread: ${threadID} | ${threadData.threadName} | ${config.database.type}`);
		}
		catch (err) {
			global.temp.createThreadDataError.push(threadID);
			log.err("DATABASE", getText("handlerCheckData", "cantCreateThread", threadID), err);
		}
	}
	// ————————————— CHECK USER DATA ————————————— //
	if (senderID && !db.allUserData.some(u => u.userID == senderID)) {
		try {
			const userData = await usersData.create(senderID);
			log.info("DATABASE", `New User: ${senderID} | ${userData.name} | ${config.database.type}`);
		}
		catch (err) {
			log.err("DATABASE", getText("handlerCheckData", "cantCreateUser", senderID), err);
		}
	}
};