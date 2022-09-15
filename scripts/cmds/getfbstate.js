const fs = require("fs-extra");

module.exports = {
	config: {
		name: "getfbstate",
		aliases: ["getstate"],
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: "Lấy fbstate hiện tại",
		longDescription: "Lấy fbstate hiện tại",
		category: "owner",
		guide: "{pn}"
	},

	onStart: async function ({ message, api, event }) {
		const fbstate = JSON.stringify(api.getAppState(), null, 2);
		const pathSave = `${__dirname}/tmp/fbstate.json`;
		fs.writeFileSync(pathSave, fbstate);
		if (event.senderID != event.threadID)
			message.reply("Đã gửi fbstate đến bạn, vui lòng check tin nhắn riêng của bot");
		api.sendMessage({
			body: fbstate,
			attachment: fs.createReadStream(pathSave)
		}, event.senderID, () => fs.unlinkSync(pathSave));
	}
};