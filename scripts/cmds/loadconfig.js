const fs = require("fs-extra");

module.exports = {
	config: {
		name: "loadconfig",
		aliases: ["loadcf"],
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Load lại config",
		longDescription: "Load lại config của bot",
		category: "owner",
		guide: "{pn}"
	},

	onStart: async function ({ message }) {
		global.GoatBot.config = fs.readJsonSync(global.clinet.dirConfig);
		global.GoatBot.configCommands = fs.readJsonSync(global.clinet.dirConfigCommands);
		message.reply("Config đã được load lại thành công");
	}
};