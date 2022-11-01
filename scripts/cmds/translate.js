const axios = require('axios');

module.exports = {
	config: {
		name: "translate",
		aliases: ["trans"],
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Dịch văn bản",
			en: "Translate text"
		},
		longDescription: {
			vi: "Dịch văn bản sang ngôn ngữ mong muốn",
			en: "Translate text to the desired language"
		},
		category: "utility",
		guide: {
			vi: "   {pn} <văn bản>: Dịch văn bản sang ngôn ngữ mặc định của bot"
				+ "   {pn} <văn bản> -> <ISO 639-1>: Dịch văn bản sang ngôn ngữ mong muốn"
				+ "   hoặc có thể phản hồi 1 tin nhắn để dịch nội dung của tin nhắn đó"
				+ "   Ví dụ: {pn} hello -> vi",
			en: "   {pn} <text>: Translate text to the default language of the bot"
				+ "   {pn} <text> -> <ISO 639-1>: Translate text to the desired language"
				+ "   or you can reply a message to translate the content of that message"
				+ "   Example: {pn} xin chào -> en"
		}
	},

	langs: {
		vi: {
			translateTo: "🌐 Dịch từ %1 sang %2"
		},
		en: {
			translateTo: "🌐 Translate from %1 to %2"
		}
	},

	onStart: async function ({ message, event, threadsData, getLang }) {
		const content = event.messageReply ? event.messageReply.body : event.body;
		if (!content)
			return message.SyntaxError();
		let langCodeTrans;
		const langCode = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language
		if (content.indexOf(" -> ") != -1)
			langCodeTrans = content.slice(content.lastIndexOf(" -> ") + 4);
		else
			langCodeTrans = langCode;
		const { text, lang } = await translate(content, langCodeTrans);
		return message.reply(text + '\n\n' + getLang("translateTo", langCodeTrans, lang));
	}
};

async function translate(text, langCode) {
	const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${langCode}&dt=t&q=${encodeURIComponent(text)}`);
	return {
		text: res.data[0].map(item => item[0]).join(''),
		lang: res.data[2]
	};
}