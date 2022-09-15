module.exports = {
	config: {
		name: "unsend",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Gỡ tin nhắn của bot",
		longDescription: "Gỡ tin nhắn của bot",
		category: "box chat",
		guide: "reply tin nhắn muốn gỡ của bot và gọi lệnh {pn}"
	},

	onStart: async function ({ message, event, api }) {
		if (!event.messageReply || event.messageReply.senderID != api.getCurrentUserID())
			return message.reply("Vui lòng phản hồi tin nhắn của bot để gỡ");
		message.unsend(event.messageReply.messageID);
	}
};