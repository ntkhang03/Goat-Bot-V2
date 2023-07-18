const { GoatBotApis } = global.utils;

module.exports = {
	config: {
		name: "texttoimage",
		aliases: ["midjourney", "openjourney", "text2image"],
		version: "1.2",
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
			vi: "   {pn} <prompt>: tạo ảnh từ văn bản của bạn"
				+ "\n    Ví dụ: {pn} mdjrny-v4 create a gta style house, gta, 4k, hyper detailed, cinematic, realistic, unreal engine, cinematic lighting, bright lights"
				+ "\n    Example: {pn} mdjrny-v4 create a gta style house, gta, 4k, hyper detailed, cinematic, realistic, unreal engine, cinematic lighting, bright lights"
		}
	},

	langs: {
		vi: {
			syntaxError: "⚠️ Vui lòng nhập prompt",
			error: "❗ Đã có lỗi xảy ra, vui lòng thử lại sau:\n%1",
			serverError: "❗ Server đang quá tải, vui lòng thử lại sau",
			missingGoatApiKey: "❗ Chưa cài đặt apikey cho GoatBot, vui lòng truy cập goatbot.tk để lấy apikey và cài đặt vào file configCommands.json > envGlobal.goatbotApikey và lưu lại"
		},
		en: {
			syntaxError: "⚠️ Please enter prompt",
			error: "❗ An error has occurred, please try again later:\n%1",
			serverError: "❗ Server is overloaded, please try again later",
			missingGoatApiKey: "❗ Not set apikey for GoatBot, please visit goatbot.tk to get apikey and set it to configCommands.json > envGlobal.goatbotApikey and save"
		}
	},

	onStart: async function ({ message, args, getLang, envGlobal }) {
		const goatBotApi = new GoatBotApis(envGlobal.goatbotApikey);
		if (!goatBotApi.isSetApiKey())
			return message.reply(getLang("missingGoatApiKey"));
		const prompt = args.join(" ");
		if (!prompt)
			return message.reply(getLang("syntaxError"));

		try {
			const { data: imageStream } = await goatBotApi.api({
				url: "/image/mdjrny",
				method: "GET",
				params: {
					prompt,
					style_id: 28,
					aspect_ratio: "1:1"
				},
				responseType: "stream"
			});

			imageStream.path = "image.jpg";

			return message.reply({
				attachment: imageStream
			});
		}
		catch (err) {
			return message.reply(getLang("error", err.data?.message || err.message));
		}
	}
};