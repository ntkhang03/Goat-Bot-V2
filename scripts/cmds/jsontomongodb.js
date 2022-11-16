module.exports = {
	config: {
		name: "jsontomongodb",
		aliases: ["jsontomongo"],
		version: "1.2",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "Đồng bộ dữ liệu từ json sang mongodb",
			en: "Synchronize data from json to ]mongodb"
		},
		longDescription: {
			vi: "Đồng bộ dữ liệu từ json sang mongodb",
			en: "Synchronize data from json to mongodb"
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
			successThread: "✅ Đã đồng bộ dữ liệu nhóm từ json sang mongodb thành công!",
			successUser: "✅ Đã đồng bộ dữ liệu người dùng từ json sang mongodb thành công!",
			successDashboard: "✅ Đã đồng bộ dữ liệu dashboard từ json sang mongodb thành công!",
			successGlobal: "✅ Đã đồng bộ dữ liệu global từ json sang mongodb thành công!"
		},
		en: {
			formatInvalid: "❌ Data format is invalid",
			error: "❌ An error occurred:\n%1: %2",
			successThread: "✅ Successfully synchronized thread data from json to mongodb!",
			successUser: "✅ Successfully synchronized user data from json to mongodb!",
			successDashboard: "✅ Successfully synchronized dashboard data from json to mongodb!",
			successGlobal: "✅ Successfully synchronized global data from json to mongodb!"
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
						if (threadIndex == -1)
							global.db.allThreadData.push((await threadModel.create(thread)).toObject());
						else
							global.db.allThreadData[threadIndex] = await threadModel.findOneAndUpdate({ threadID: thread.threadID }, thread, { returnDocument: 'after' });
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
						if (userIndex == -1)
							global.db.allUserData.push((await userModel.create(user)).toObject());
						else
							global.db.allUserData[userIndex] = await userModel.findOneAndUpdate({ userID: user.userID }, user, { returnDocument: 'after' });
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
						if (dashboardIndex == -1)
							global.db.dashBoardData.push((await dashBoardModel.create(dashboard)).toObject());
						else
							global.db.dashBoardData[dashboardIndex] = await dashBoardModel.findOneAndUpdate({ userID: dashboard.userID }, dashboard, { returnDocument: 'after' });
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
						global.db.globalData.push((await globalModel.create(global_)).toObject());
					else
						global.db.globalData[globalIndex] = await globalModel.findOneAndUpdate({ key: global_.key }, global_, { returnDocument: 'after' });
				}
				return message.reply(getLang("successGlobal"));
			}
			default:
				return message.SyntaxError();
		}
	}
};