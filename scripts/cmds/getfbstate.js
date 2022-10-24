const fs = require("fs-extra");

module.exports = {
	config: {
		name: "getfbstate",
		aliases: ["getstate"],
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "Lấy fbstate hiện tại",
			en: "Get current fbstate"
		},
		longDescription: {
			vi: "Lấy fbstate hiện tại",
			en: "Get current fbstate"
		},
		category: "owner",
		guide: {
			en: "{pn}"
		}
	},

	langs: {
		vi: {
			success: "Đã gửi fbstate đến bạn, vui lòng check tin nhắn riêng của bot"
		},
		en: {
			success: "Sent fbstate to you, please check bot's private message"
		}
	},

	onStart: async function ({ message, api, event, getLang }) {
		const fbstate = JSON.stringify(api.getAppState(), null, 2);
		const pathSave = `${__dirname}/tmp/fbstate.json`;
		fs.writeFileSync(pathSave, fbstate);
		if (event.senderID != event.threadID)
			message.reply(getLang("success"));
		api.sendMessage({
			body: fbstate,
			attachment: fs.createReadStream(pathSave)
		}, event.senderID, () => fs.unlinkSync(pathSave));
	}
};