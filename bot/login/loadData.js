const chalk = require('chalk');
const path = require('path');
const { log, createOraDots, getText } = global.utils;

module.exports = async function (api, createLine) {
	// ———————————————————— LOAD DATA ———————————————————— //
	console.log(chalk.hex("#f5ab00")(createLine("DATABASE")));
	const controller = await require(path.join(__dirname, '..', '..', 'database/controller/index.js'))(api); // data is loaded here
	const { threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, sequelize } = controller;
	log.info('DATABASE', getText('loadData', 'loadThreadDataSuccess', global.db.allThreadData.filter(t => t.threadID.toString().length > 15).length));
	log.info('DATABASE', getText('loadData', 'loadUserDataSuccess', global.db.allUserData.length));
	if (api && global.GoatBot.config.database.autoSyncWhenStart == true) {
		console.log(chalk.hex("#f5ab00")(createLine("AUTO SYNC")));
		const spin = createOraDots(getText('loadData', 'refreshingThreadData'));
		try {
			api.setOptions({
				logLevel: 'silent'
			});
			spin._start();
			const threadDataWillSet = [];
			const allThreadData = [...global.db.allThreadData];
			const allThreadInfo = await api.getThreadList(9999999, null, 'INBOX');
			for (const threadInfo of allThreadInfo) {
				if (threadInfo.isGroup && !allThreadData.some(thread => thread.threadID === threadInfo.threadID))
					threadDataWillSet.push(await threadsData.create(threadInfo.threadID, threadInfo));
				else {
					const threadRefreshed = await threadsData.refreshInfo(threadInfo.threadID, threadInfo);
					allThreadData.splice(allThreadData.findIndex(thread => thread.threadID === threadInfo.threadID), 1);
					threadDataWillSet.push(threadRefreshed);
				}
				global.db.receivedTheFirstMessage[threadInfo.threadID] = true;
			}

			const allThreadDataDontHaveBot = allThreadData.filter(thread => !allThreadInfo.some(thread1 => thread.threadID === thread1.threadID));
			const botID = api.getCurrentUserID();
			for (const thread of allThreadDataDontHaveBot) {
				const findMe = thread.members.find(m => m.userID == botID);
				if (findMe) {
					findMe.inGroup = false;
					await threadsData.set(thread.threadID, { members: thread.members });
				}
			}
			global.db.allThreadData = [
				...threadDataWillSet,
				...allThreadDataDontHaveBot
			];
			spin._stop();
			log.info('DATABASE', getText('loadData', 'refreshThreadDataSuccess', global.db.allThreadData.length));
		}
		catch (err) {
			spin._stop();
			log.error('DATABASE', getText('loadData', 'refreshThreadDataError'), err);
		}
		finally {
			api.setOptions({
				logLevel: global.GoatBot.config.optionsFca.logLevel
			});
		}
	}
	// ————————————— ——————————— ———————————— ——————————— //
	return {
		threadModel: threadModel || null,
		userModel: userModel || null,
		dashBoardModel: dashBoardModel || null,
		globalModel: globalModel || null,
		threadsData,
		usersData,
		dashBoardData,
		globalData,
		sequelize
	};
};