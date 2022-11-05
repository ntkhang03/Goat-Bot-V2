const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
	config: {
		name: "adminonly",
		aliases: ["adonly", "onlyad", "onlyadmin"],
		version: "1.2",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "bật/tắt chỉ admin sử dụng bot",
			en: "turn on/off only admin can use bot"
		},
		longDescription: {
			vi: "bật/tắt chế độ chỉ admin mới có thể sử dụng bot",
			en: "turn on/off only admin can use bot"
		},
		category: "owner",
		guide: {
			en: "{pn} [on | off]"
		}
	},

	langs: {
		vi: {
			turnedOn: "Đã bật chế độ chỉ admin mới có thể sử dụng bot",
			turnedOff: "Đã tắt chế độ chỉ admin mới có thể sử dụng bot",
			syntaxError: "Sai cú pháp, chỉ có thể dùng {pn} on hoặc {pn} off"
		},
		en: {
			turnedOn: "Turned on the mode only admin can use bot",
			turnedOff: "Turned off the mode only admin can use bot",
			syntaxError: "Syntax error, only use {pn} on or {pn} off"
		}
	},

	onStart: function ({ args, message, getLang  }) {
		if (args[0] == "on") {
			config.adminOnly.enable = true;
			message.reply(getLang("turnedOn"));
			fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
		}
		else if (args[0] == "off") {
			config.adminOnly.enable = false;
			message.reply(getLang("turnedOff"));
			fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
		}
		else
			return message.reply(getLang("syntaxError"));
	}
};