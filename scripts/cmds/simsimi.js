const axios = require('axios');
const langsSupport = ["vn", "en", "ph", "zh", "ch", "ru", "id", "ko", "ar", "ms", "fr", "ja", "es", "de", "pt", "ml", "si", "tr"];

module.exports = {
	config: {
		name: 'simsimi',
		aliases: ['sim'],
		version: '1.2',
		author: 'NTKhang',
		countDown: 5,
		role: 0,
		shortDescription: 'Simsimi',
		longDescription: {
			vi: 'Chat với simsimi',
			en: 'Chat with simsimi'
		},
		category: 'funny',
		guide: {
			vi: '   {pn} [on | off]: bật/tắt simsimi'
				+ '\n'
				+ '\n   {pn} <word>: chat nhanh với simsimi'
				+ '\n   Ví dụ:\n    {pn} hi',
			en: '   {pn} [on | off]: turn on/off simsimi'
				+ '\n'
				+ '\n   {pn} <word>: chat with simsimi'
				+ '\n   Example:\n    {pn} hi'
		}
	},

	langs: {
		vi: {
			turnedOn: 'Bật simsimi thành công!',
			turnedOff: 'Tắt simsimi thành công!',
			chatting: 'Đang chat với simsimi...',
			error: 'Simsimi đang bận, bạn hãy thử lại sau'
		},
		en: {
			turnedOn: 'Turned on simsimi successfully!',
			turnedOff: 'Turned off simsimi successfully!',
			chatting: 'Chatting with simsimi...',
			error: 'Simsimi is busy, please try again later'
		}
	},

	onStart: async function ({ args, threadsData, message, event, getLang }) {
		if (args[0] == 'on' || args[0] == 'off') {
			await threadsData.set(event.threadID, args[0] == "on", "settings.simsimi");
			return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async ({ args, message, threadsData, event, isUserCallCommand, getLang }) => {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.simsimi")) {
			try {
				const langCode = await threadsData.get(event.threadID, "settings.lang") || global.GoatBot.config.language;
				const responseMessage = await getMessage(args.join(" "), langCode);
				return message.reply(`${responseMessage}\n🐣 Simsimi trả lời bạn!`);
			}
			catch (err) {
				return message.reply(getLang("error"));
			}
		}
	}
};

async function getMessage(yourMessage, langCode) {
	const res = await axios.get(`https://api.simsimi.net/v2`, {
		params: {
			text: yourMessage,
			lc: global.GoatBot.config.language == 'vi' ? 'vn' : langsSupport.includes(langCode) ? langCode : 'en',
			cf: false
		}
	});

	if (res.status > 200)
		throw new Error(res.data.success);

	return res.data.success;
}