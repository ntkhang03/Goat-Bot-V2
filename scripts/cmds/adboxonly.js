module.exports = {
	config: {
		name: "onlyadminbox",
		aliases: ["onlyadbox", "adboxonly", "adminboxonly"],
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 1,
		shortDescription: {
			vi: "bật/tắt chỉ admin box sử dụng bot",
			en: "turn on/off only admin box can use bot"
		},
		longDescription: {
			vi: "bật/tắt chế độ chỉ quản trị của viên nhóm mới có thể sử dụng bot",
			en: "turn on/off only admin box can use bot"
		},
		category: "box chat",
		guide: {
			en: "   {pn} [on | off]"
		}
	},

	langs: {
		vi: {
			turnedOn: "Đã bật chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot",
			turnedOff: "Đã tắt chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot",
			syntaxError: "Sai cú pháp, chỉ có thể dùng {pn} on hoặc {pn} off"
		},
		en: {
			turnedOn: "Turned on the mode only admin of group can use bot",
			turnedOff: "Turned off the mode only admin of group can use bot",
			syntaxError: "Syntax error, only use {pn} on or {pn} off"
		}
	},

	onStart: async function ({ args, message, event, threadsData, getLang }) {
		if (args[0] == "on") {
			await threadsData.set(event.threadID, true, "data.onlyAdminBox");
			message.reply(getLang("turnedOn"));
		}
		else if (args[0] == "off") {
			await threadsData.set(event.threadID, false, "data.onlyAdminBox");
			message.reply(getLang("turnedOff"));
		}
		else
			return message.reply(getLang("syntaxError"));
	}
};