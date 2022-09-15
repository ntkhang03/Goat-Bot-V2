const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "dhbc",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "game đuổi hình bắt chữ",
		longDescription: "chơi game đuổi hình bắt chữ",
		category: "game",
		guide: "{pn}"
	},

	onStart: async function ({ message, event, commandName }) {
		const datagame = (await axios.get("https://goatbot.up.railway.app/api/duoihinhbatchu")).data;
		const { wordcomplete, casi, image1, image2 } = datagame.data;

		message.reply({
			body: `Hãy reply tin nhắn này với câu trả lời\n${wordcomplete.replace(/\S/g, "█ ")}${casi ? `\nĐây là tên bài hát của ca sĩ ${casi}` : ''}`,
			attachment: [
				await getStreamFromURL(image1),
				await getStreamFromURL(image2)
			]
		}, (err, info) => {
			global.GoatBot.onReply.set(info.messageID, {
				commandName,
				messageID: info.messageID,
				author: event.senderID,
				wordcomplete
			});
		});
	},

	onReply: ({ message, Reply, event }) => {
		const { author, wordcomplete, messageID } = Reply;
		if (event.senderID != author)
			return message.reply("⚠️ Bạn không phải là người chơi của câu hỏi này");
		function formatText(text) {
			return text.normalize("NFD")
				.toLowerCase()
				.replace(/[\u0300-\u036f]/g, "")
				.replace(/[đ|Đ]/g, (x) => x == "đ" ? "d" : "D");
		}

		(formatText(event.body) == formatText(wordcomplete)) ? message.reply("Chúc mừng bạn đã trả lời đúng") : message.reply(`Opps, bạn trả lời sai rồi`);
		//message.reply(`Sai rồi, đáp án đúng là: ${wordcomplete}`);
		global.GoatBot.onReply.delete(messageID);
	}
};