const { getStreamsFromAttachment, checkAndTranslate } = global.utils;

module.exports = {
	config: {
		name: "notification",
		aliases: ["notify", "noti"],
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: "Gửi thông báo từ admin đến all box",
		longDescription: "Gửi thông báo từ admin đến all box",
		category: "owner",
		guide: "{pn} <tin nhắn>",
		envConfig: {
			delayPerGroup: 250
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands }) {
		const { delayPerGroup } = envCommands[commandName];
		if (!args[0])
			return message.reply("Vui lòng nhập tin nhắn bạn muốn gửi đến tất cả các nhóm");
		const formSend = await checkAndTranslate({
			body: `Thông báo từ admin bot đến tất cả nhóm chat (không phản hồi tin nhắn này)\n────────────────\n{{${args.join(" ")}}}`,
			attachment: await getStreamsFromAttachment([...event.attachments, ...(event.messageReply?.attachments || [])])
		});

		const allThreadID = (await api.getThreadList(2000, null, ["INBOX"]))
			.filter(item => item.isGroup === true && item.threadID != event.threadID)
			.map(item => item = item.threadID);
		message.reply(`Bắt đầu gửi thông báo từ admin bot đến ${allThreadID.length} nhóm chat`);

		let sendSucces = 0;
		const sendError = [];
		const wattingSend = [];

		for (const tid of allThreadID) {
			try {
				wattingSend.push({
					threadID: tid,
					pending: api.sendMessage(formSend, tid)
				});
				await new Promise(resolve => setTimeout(resolve, delayPerGroup));
			}
			catch (e) {
				sendError.push(tid);
			}
		}

		for (const sended of wattingSend) {
			try {
				await sended.pending;
				sendSucces++;
			}
			catch (e) {
				sendError.push(sended.threadID);
			}
		}

		message.reply(`✅ Đã gửi thông báo đến ${sendSucces} nhóm thành công${sendError.length > 0 ? `\n❌ Có lỗi xảy ra khi gửi đến ${sendError.length} nhóm:\n${sendError.join("\n ")}` : ""}`);
	}
};