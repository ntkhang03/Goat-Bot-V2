const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "openjourney",
		aliases: ["midjourney"],
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Tạo ảnh từ văn bản của bạn",
			en: "Create image from your text"
		},
		longDescription: {
			uid: "Tạo ảnh từ văn bản của bạn",
			en: "Create image from your text"
		},
		category: "info",
		guide: {
			vi: "   {pn} <prompt>: tạo ảnh từ văn bản của bạn",
			en: "   {pn} <prompt>: create image from your text"
		}
	},

	langs: {
		vi: {
			syntaxError: "⚠️ Vui lòng nhập prompt",
			error: "❗ Đã có lỗi xảy ra, vui lòng thử lại sau"
		},
		en: {
			syntaxError: "⚠️ Please enter prompt",
			error: "❗ An error has occurred, please try again later"
		}
	},

	onStart: async function ({ message, args, getLang }) {
		const prompt = args.join(" ");
		if (!prompt)
			return message.reply(getLang("syntaxError"));

		const { data } = await axios({
			url: "https://goatbotserver.onrender.com/taoanhdep/openjourney",
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			data: {
				prompt,
				parameters: {}
			}
		});

		const imageUrl = data[0];
		const imageStream = await getStreamFromURL(imageUrl, "openjourney.png");
		return message.reply({
			attachment: imageStream
		});
	}
};