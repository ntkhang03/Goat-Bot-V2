const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
	config: {
		name: "adminonly",
		aliases: ["adonly", "onlyad", "onlyadmin"],
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: "bật/tắt chỉ admin sử dụng bot",
		longDescription: "bật/tắt chế độ chỉ admin mới có thể sử dụng bot",
		category: "owner",
		guide: "{pn} {{[on | off]}}"
	},

	onStart: function ({ args, message }) {
		if (args[0] == "on") {
			config.adminOnly = true;
			message.reply("Đã bật chế độ chỉ admin mới có thể sử dụng bot");
			fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
		}
		else if (args[0] == "off") {
			config.adminOnly = false;
			message.reply("Đã tắt chế độ chỉ admin mới có thể sử dụng bot");
			fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
		}
		else
			return message.reply("Vui lòng chọn chế độ on hoặc off");
	}
};