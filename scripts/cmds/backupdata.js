const fs = require("fs-extra");

module.exports = {
	config: {
		name: "backupdata",
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "Sao lưu dữ liệu",
			en: "Backup data"
		},
		longDescription: {
			vi: "Sao lưu dữ liệu của bot (threads, users, dashboard, globalData)",
			en: "Backup data of bot (threads, users, dashboard, globalData)"
		},
		category: "owner",
		guide: {
			en: "   {pn}"
		}
	},

	langs: {
		vi: {
			backedUp: "Đã sao lưu dữ liệu của bot vào thư mục scripts/cmds/tmp"
		},
		en: {
			backedUp: "Bot data has been backed up to the scripts/cmds/tmp folder"
		}
	},

	onStart: async function ({ message, getLang, threadsData, usersData, dashBoardData, globalData }) {
		const globalDataBackup = globalData.getAll();
		const threadsDataBackup = threadsData.getAll();
		const usersDataBackup = usersData.getAll();
		const dashBoardDataBackup = dashBoardData.getAll();

		const pathThreads = __dirname + "/tmp/threadsData.json";
		const pathUsers = __dirname + "/tmp/usersData.json";
		const pathDashBoard = __dirname + "/tmp/dashBoardData.json";
		const pathGlobal = __dirname + "/tmp/globalData.json";

		fs.writeFileSync(pathThreads, JSON.stringify(threadsDataBackup, null, 2));
		fs.writeFileSync(pathUsers, JSON.stringify(usersDataBackup, null, 2));
		fs.writeFileSync(pathDashBoard, JSON.stringify(dashBoardDataBackup, null, 2));
		fs.writeFileSync(pathGlobal, JSON.stringify(globalDataBackup, null, 2));

		message.reply({
			body: getLang("backedUp"),
			attachment: [
				fs.createReadStream(pathThreads),
				fs.createReadStream(pathUsers),
				fs.createReadStream(pathDashBoard),
				fs.createReadStream(pathGlobal)
			]
		});
	}
};