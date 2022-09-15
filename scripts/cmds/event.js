const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "event",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: "Quản lý command event",
		longDescription: "Quản lý các tệp lệnh event của bạn",
		category: "owner",
		guide: "{pn} {{load}} <tên file lệnh>"
			+ "\n{pn} {{loadAll}}"
	},

	onStart: ({ args, message, api, threadModel, userModel, threadsData, usersData }) => {
		const { configCommands } = global.GoatBot;
		const { log, loadScripts } = global.utils;

		if (args[0] == "load" && args.length == 2) {
			if (!args[1])
				return message.reply("⚠️ | Vui lòng nhập vào tên lệnh bạn muốn reload");
			const infoLoad = loadScripts("events", args[1], log, configCommands, api, threadModel, userModel, threadsData, usersData);
			infoLoad.status == "success" ?
				message.reply(`✅ | Đã load command event {{${infoLoad.name}}} thành công`)
				: message.reply(`❌ | Load command event {{${infoLoad.name}}} thất bại với lỗi\n${infoLoad.error.stack}`);
		}
		else if (args[0].toLowerCase() == "loadall" || (args[0] == "load" && args.length > 2)) {
			const allFile = args[0].toLowerCase() == "loadall" ?
				fs.readdirSync(path.join(__dirname, "..", "events"))
					.filter(item => item.endsWith(".js"))
					.map(item => item = item.split(".")[0]) :
				args.slice(1);
			const arraySucces = [];
			const arrayFail = [];
			for (const fileName of allFile) {
				const infoLoad = loadScripts("events", fileName, log, configCommands, api, threadModel, userModel, threadsData, usersData);
				infoLoad.status == "success" ?
					arraySucces.push(fileName)
					: arrayFail.push(`{{${fileName}: ${infoLoad.error.name}: ${infoLoad.error.stack.split("\n").slice(0, 5).join("\n")}}}`);
			}
			message.reply(
				arraySucces.length > 0 ? `✅ | Đã load thành công ${arraySucces.length} command event` : ""
					+ arrayFail.length > 0 ? `\n\n❌ | Load thất bại ${arrayFail.length} command\n${"❗" + arrayFail.join("\n❗ ")})` : ""
			);
		}
		else
			message.SyntaxError();
	}
};