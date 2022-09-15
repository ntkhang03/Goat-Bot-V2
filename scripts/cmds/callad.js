const { getStreamsFromAttachment, checkAndTranslate } = global.utils;

module.exports = {
	config: {
		name: "callad",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "gửi tin nhắn về admin bot",
		longDescription: "gửi báo cáo, góp ý, báo lỗi,... của bạn về admin bot",
		category: "contacts admin",
		guide: "{pn} <tin nhắn>"
	},

	onStart: async function ({ args, message, event, usersData, threadsData, api, commandName }) {
		const { config } = global.GoatBot;
		if (!args[0])
			return message.reply("Vui lòng nhập tin nhắn bạn muốn gửi về admin");
		const { senderID, threadID, isGroup } = event;

		const senderName = await usersData.getName(senderID);
		const msg = "==📨️ CALL ADMIN 📨️=="
			+ `\n- User Name: ${senderName}`
			+ `\n- User ID: ${senderID}`
			+ `\n- Được gửi từ ` + (isGroup ? `nhóm: ${(await threadsData.get(threadID)).threadName}\n- Thread ID: ${threadID}` : "cá nhân");

		api.sendMessage(await checkAndTranslate({
			body: msg + `\n\nNội dung:\n─────────────────\n${args.join(" ")}\n─────────────────\nPhản hồi tin nhắn này để gửi tin nhắn về người dùng`,
			mentions: [{
				id: senderID,
				tag: senderName
			}],
			attachment: await getStreamsFromAttachment([...event.attachments, ...(event.messageReply?.attachments || [])])
		}), config.adminBot[0], (err, info) => {
			if (err)
				return message.err(err);
			message.reply("Đã gửi tin nhắn của bạn về admin thành công!");
			global.GoatBot.onReply.set(info.messageID, {
				commandName,
				messageID: info.messageID,
				threadID,
				messageIDSender: event.messageID,
				type: "userCallAdmin"
			});
		});
	},

	onReply: async ({ args, event, api, message, Reply, usersData, commandName }) => {
		const { type, threadID, messageIDSender } = Reply;
		const senderName = await usersData.getName(event.senderID);

		switch (type) {
			case "userCallAdmin": {
				api.sendMessage(await checkAndTranslate({
					body: `📍 Phản hồi từ admin {{${senderName}}}:\n{{${args.join(" ")}}}`
						+ `\n─────────────────\nPhản hồi tin nhắn này để tiếp tục gửi tin nhắn về admin`,
					mentions: [{
						id: event.senderID,
						tag: senderName
					}],
					attachment: await getStreamsFromAttachment(event.attachments)
				}), threadID, (err, info) => {
					if (err)
						return message.err(err);
					message.reply("Đã gửi phản hồi của bạn về admin thành công!");
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "adminReply"
					});
				}, messageIDSender);
				break;
			}
			case "adminReply": {
				api.sendMessage(await checkAndTranslate({
					body: `📝 Phản hồi từ người dùng {{${senderName}}}:`
						+ `\n- User ID: ${event.senderID}`
						+ `\n- Nội dung:\n{{${args.join(" ")}}}`
						+ `\n─────────────────\nPhản hồi tin nhắn này để gửi tin nhắn về người dùng`,
					mentions: [{
						id: event.senderID,
						tag: senderName
					}],
					attachment: await getStreamsFromAttachment(event.attachments)
				}), threadID, (err, info) => {
					if (err)
						return message.err(err);
					message.reply("Đã gửi phản hồi của bạn về người dùng thành công!");
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "userCallAdmin"
					});
				}, messageIDSender);
				break;
			}
			default: {
				break;
			}
		}
	}
};