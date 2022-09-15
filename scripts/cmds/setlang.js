const fs = require("fs-extra");

module.exports = {
	config: {
		name: "setlang",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: "Cài đặt ngôn ngữ mặc định",
		longDescription: "Cài đặt ngôn ngữ mặc định cho bot",
		category: "owner",
		guide: "{pn} {{<language code ISO 639-1}}"
			+ "\nVí dụ:"
			+ "   {pn} en"
			+ "   {pn} vi"
			+ "   {pn} ja"
	},

	onStart: function ({ message, args }) {
		if (!args[0])
			return message.SyntaxError;
		const langCode = args[0].toLowerCase();
		global.GoatBot.config.language = langCode;
		fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
		return message.reply(`Đã cài đặt ngôn ngữ mặc định là: {{${langCode}}}`);
	}
};