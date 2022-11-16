module.exports = {
	config: {
		name: "jsontosqlite",
		version: "1.2",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "Đồng bộ dữ liệu từ json sang sqlite",
			en: "Synchronize data from json to sqlite"
		},
		longDescription: {
			vi: "Đồng bộ dữ liệu từ json sang sqlite",
			en: "Synchronize data from json to sqlite"
		},
		category: "owner",
		guide: {
			en: "{pn} <thread | user | dashboard | global>"
		}
	},

	langs: {
		vi: {
			formatInvalid: "❌ Định dạng dữ liệu không hợp lệ",
			error: "❌ Đã có lỗi xảy ra:\n%1: %2",
			successThread: "✅ Đã đồng bộ dữ liệu nhóm từ json sang sqlite thành công!",
			successUser: "✅ Đã đồng bộ dữ liệu người dùng từ json sang sqlite thành công!",
			successDashboard: "✅ Đã đồng bộ dữ liệu dashboard từ json sang sqlite thành công!",
			successGlobal: "✅ Đã đồng bộ dữ liệu global từ json sang sqlite thành công!"
		},
		en: {
			formatInvalid: "❌ Data format is invalid",
			error: "❌ An error occurred:\n%1: %2",
			successThread: "✅ Successfully synchronized thread data from json to sqlite!",
			successUser: "✅ Successfully synchronized user data from json to sqlite!",
			successDashboard: "✅ Successfully synchronized dashboard data from json to sqlite!",
			successGlobal: "✅ Successfully synchronized global data from json to sqlite!"
		}
	},

	onStart: async function ({ args, message, threadModel, userModel, dashBoardModel, globalModel, getLang }) {
		switch (args[0]) {
			case "thread": {
				let oldThreadsData;
				try {
					oldThreadsData = require("../../database/data/threadsData.json");
				}
				catch (err) {
					return message.reply(getLang("formatInvalid"));
				}
				try {
					for (const thread of oldThreadsData) {
						const threadIndex = global.db.allThreadData.findIndex(item => item.threadID == thread.threadID);
						if (threadIndex == -1) {
							global.db.allThreadData.push((await threadModel.create(thread)).get({ plain: true }));
						}
						else {
							global.db.allThreadData[threadIndex] = (await (await threadModel.findOne({ where: { threadID: thread.threadID } }))
								.update(thread))
								.get({ plain: true });
						}
					}
					return message.reply(getLang("successThread"));
				}
				catch (err) {
					return message.reply(getLang("error", err.name, err.message));
				}
			}
			case "user": {
				let oldUsersData;
				try {
					oldUsersData = require("../../database/data/usersData.json");
				}
				catch (err) {
					return message.reply(getLang("formatInvalid"));
				}
				try {
					for (const user of oldUsersData) {
						const userIndex = global.db.allUserData.findIndex(item => item.userID == user.userID);
						if (userIndex == -1) {
							global.db.allUserData.push((await userModel.create(user)).get({ plain: true }));
						}
						else {
							global.db.allUserData[userIndex] = (await (await userModel.findOne({ where: { userID: user.userID } }))
								.update(user))
								.get({ plain: true });
						}
					}
					return message.reply(getLang("successUser"));
				}
				catch (err) {
					return message.reply(getLang("error", err.name, err.message));
				}
			}
			case "dashboard": {
				let oldDashBoardData;
				try {
					oldDashBoardData = require("../../database/data/dashBoardData.json");
				}
				catch (err) {
					return message.reply(getLang("formatInvalid"));
				}
				try {
					for (const dashboard of oldDashBoardData) {
						const dashboardIndex = global.db.dashBoardData.findIndex(item => item.userID == dashboard.userID);
						if (dashboardIndex == -1) {
							global.db.dashBoardData.push((await dashBoardModel.create(dashboard)).get({ plain: true }));
						}
						else {
							global.db.dashBoardData[dashboardIndex] = (await (await dashBoardModel.findOne({ where: { userID: dashboard.userID } }))
								.update(dashboard))
								.get({ plain: true });
						}
					}
					return message.reply(getLang("successDashboard"));
				}
				catch (err) {
					return message.reply(getLang("error", err.name, err.message));
				}
			}
			case "global": {
				let oldGlobalData;
				try {
					oldGlobalData = require("../../database/data/globalData.json");
				}
				catch (err) {
					return message.reply(getLang("formatInvalid"));
				}
				for (const global_ of oldGlobalData) {
					const globalIndex = global.db.globalData.findIndex(item => item.key == global_.key);
					if (globalIndex == -1)
						global.db.globalData.push((await globalModel.create(global_)).get({ plain: true }));
					else
						global.db.globalData[globalIndex] = (await (await globalModel.findOne({ where: { key: global_.key } }))
							.update(global_))
							.get({ plain: true });
				}
				return message.reply(getLang("successGlobal"));
			}
			default:
				return message.SyntaxError();
		}
	}
};