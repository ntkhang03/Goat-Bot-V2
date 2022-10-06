const axios = require('axios');

module.exports = {
	config: {
		name: 'simsimi',
		aliases: ['sim'],
		version: '1.1',
		author: 'NTKhang',
		countDown: 5,
		role: 0,
		shortDescription: 'Simsimi',
		longDescription: 'Chat với simsimi',
		category: 'funny',
		guide: {
			body: '   {pn} {{[on | off]}}: bật/tắt simsimi'
				+ '\n'
				+ '\n   {pn} {{<word>}}: chat nhanh với simsimi'
				+ '\n   Ví dụ: {pn} {{hi}}'
		}
	},

	onStart: async function ({ args, threadsData, message, event }) {
		if (args[0] == 'on' || args[0] == 'off') {
			await threadsData.set(event.threadID, args[0] == "on", "settings.simsimi");
			return message.reply(`Đã ${args[0] == "on" ? "bật" : "tắt"} simsimi trong nhóm bạn`);
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(`{{${responseMessage}}}`);
			}
			catch (err) {
				return message.reply("Simsimi đang bận, bạn hãy thử lại sau");
			}
		}
	},

	onChat: async ({ args, message, threadsData, event, isUserCallCommand }) => {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.simsimi")) {
			try {
				const responseMessage = await getMessage(args.join(" "));
				return message.reply(`{{${responseMessage}\n🐣 Simsimi trả lời bạn!}}`);
			}
			catch (err) {
				return message.reply("Simsimi đang bận, bạn hãy thử lại sau");
			}
		}
	}
};

async function getMessage(yourMessage) {
	const res = await axios.get(`https://api.simsimi.net/v2`, {
		params: {
			text: yourMessage,
			lc: global.GoatBot.config.language == 'vi' ? 'vn' : 'en',
			cf: false
		}
	});

	if (res.status > 200)
		throw new Error(res.data.success);

	return res.data.success;
}