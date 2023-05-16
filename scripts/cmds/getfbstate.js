const fs = require("fs-extra");

module.exports = {
	config: {
		name: "getfbstate",
		aliases: ["getstate"],
		version: "1.0",
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
			en: "   {pn}: get fbstate (appState)\n"
				+ "   {pn} [cookies|cookie|c]: get fbstate with cookies format\n"
				+ "   {pn} [string|str|s]: get fbstate with string format\n",
			vi: "   {pn}: get fbstate (appState)\n"
				+ "   {pn} [cookies|cookie|c]: get fbstate dạng cookies\n"
				+ "   {pn} [string|str|s]: get fbstate dạng string\n"
		}
	},

	langs: {
		vi: {
			success: "Đã gửi fbstate đến bạn, vui lòng kiểm tra tin nhắn riêng của bot"
		},
		en: {
			success: "Sent fbstate to you, please check bot's private message"
		}
	},

	onStart: async function ({ message, api, event, args, getLang }) {
		let fbstate;
		let extFile = "json";

		if (["cookie", "cookies", "c"].includes(args[0])) {
			fbstate = JSON.stringify(api.getAppState().map(e => ({
				name: e.key,
				value: e.value
			})), null, 2);
		}
		else if (["string", "str", "s"].includes(args[0])) {
			fbstate = api.getAppState().map(e => `${e.key}=${e.value}`).join("; ");
			extFile = "txt";
		}
		else {
			fbstate = JSON.stringify(api.getAppState(), null, 2);
		}

		const pathSave = `${__dirname}/tmp/fbstate.${extFile}`;
		fs.writeFileSync(pathSave, fbstate);

		if (event.senderID != event.threadID)
			message.reply(getLang("success"));

		api.sendMessage({
			body: fbstate,
			attachment: fs.createReadStream(pathSave)
		}, event.senderID, () => fs.unlinkSync(pathSave));
	}
};