const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
	config: {
		name: "event",
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: "Quản lý command event",
		longDescription: "Quản lý các tệp lệnh event của bạn",
		category: "owner",
		guide: "{pn} {{load}} <tên file lệnh>"
			+ "\n{pn} {{loadAll}}"
			+ "\n{pn} {{install}} <url> <tên file lệnh>: Tải về và load command event, url là đường dẫn tới file lệnh (raw)"

	},

	onReaction: async function ({ Reaction, message, event, api, threadModel, userModel, threadsData, usersData }) {
		const { author, messageID, data: { fileName, rawCode } } = Reaction;
		if (event.userID != author)
			return;
		const { configCommands } = global.GoatBot;
		const { log, loadScripts } = global.utils;
		const infoLoad = loadScripts("cmds", fileName, log, configCommands, api, threadModel, userModel, threadsData, usersData, rawCode);
		infoLoad.status == "success" ?
			message.reply(`✅ | Đã load command event {{${infoLoad.name}}} thành công`, () => message.unsend(messageID))
			: message.reply(`❌ | Load command event {{${infoLoad.name}}} thất bại với lỗi\n{{${infoLoad.error.stack}}}`, () => message.unsend(messageID));
	},

	onStart: async ({ args, message, api, threadModel, userModel, threadsData, usersData, commandName, event }) => {
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
		else if (args[0] == "install") {
			const [url, fileName] = args.slice(1);
			if (!url || !url.match(/(https?:\/\/(?:www\.|(?!www)))/))
				return message.reply("⚠️ | Vui lòng nhập vào đường dẫn tới file lệnh");
			if (!fileName || !fileName.endsWith(".js"))
				return message.reply("⚠️ | Vui lòng nhập vào tên file lệnh");
			const { data: rawCode } = await axios.get(url);
			if (!rawCode)
				return message.reply("⚠️ | Không thể lấy được mã lệnh");
			if (fs.existsSync(path.join(__dirname, '..', 'events', fileName)))
				return message.reply("⚠️ | File lệnh đã tồn tại, bạn có chắc chắn muốn ghi đè lên file lệnh cũ không?\nThả cảm xúc bất kì vào tin nhắn này để tiếp tục", (err, info) => {
					global.GoatBot.onReaction.set(info.messageID, {
						commandName,
						author: event.senderID,
						data: {
							fileName,
							rawCode
						}
					});
				});
		}
		else
			message.SyntaxError();
	}
};