const axios = require("axios");

module.exports = {
	config: {
		name: "emojimix",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Mix 2 emoji",
		longDescription: "Mix 2 emoji lại với nhau",
		guide: "{pn} <emoji1> <emoji2>\nVí dụ:  {pn} 🤣 🥰",
		category: "fun"
	},

	onStart: async function ({ message, args }) {
		const readStream = [];
		const emoji1 = args[0];
		const emoji2 = args[1];

		if (!emoji1 || !emoji2) return message.SyntaxError();

		const generate1 = await generateEmojimix(emoji1, emoji2);
		const generate2 = await generateEmojimix(emoji2, emoji1);

		if (generate1)
			readStream.push(generate1);
		if (generate2)
			readStream.push(generate2);

		if (readStream.length == 0)
			return message.reply(`Rất tiếc, emoji ${emoji1} và ${emoji2} không mix được`);

		message.reply({
			body: `Emoji ${emoji1} và ${emoji2} mix được ${readStream.length} ảnh`,
			attachment: readStream
		});
	}
};



async function generateEmojimix(emoji1, emoji2) {
	try {
		const response = (await axios.get("https://goatbot.up.railway.app/taoanhdep/emojimix", {
			params: {
				emoji1,
				emoji2
			},
			responseType: "stream"
		})).data;
		response.path = `emojimix${Date.now()}.png`;
		return response;
	}
	catch (e) {
		return null;
	}
}