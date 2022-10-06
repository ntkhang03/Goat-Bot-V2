const { drive, getStreamFromURL, getExtFromUrl, getTime } = global.utils;

module.exports = {
	config: {
		name: "setleave",
		aliases: ["setl"],
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "chỉnh sửa nội dung tin nhắn tạm biệt",
		longDescription: "chỉnh sửa nội dung tin nhắn tạm biệt thành viên rời khỏi nhóm chat của bạn",
		category: "custom",
		guide: {
			body: "{pn} {{text}} [<nội dung> | {{reset}}]: chỉnh sửa nội dung văn bản hoặc reset về mặc định, những shortcut có sẵn:"
				+ "\n  + {{{userName}}}: tên của thành viên rời khỏi nhóm"
				+ "\n  + {{{userNameTag}}}: tên của thành viên rời khỏi nhóm (tag)"
				+ "\n  + {{{boxName}}}:  tên của nhóm chat"
				+ "\n  + {{{type}}}: tự rời/bị qtv xóa khỏi nhóm"
				+ "\n  + {{{session}}}:  buổi trong ngày"
				+ "\n\nVí dụ:"
				+ "\n   {pn} text {{{userName}}} đã {{{type}}} khỏi nhóm, see you again 🤧"
				+ "\n"
				+ "\nReply (phản hồi) hoặc gửi kèm một tin nhắn có file với nội dung {pn} {{file}}: để thêm tệp đính kèm vào tin nhắn rời khỏi nhóm (ảnh, video, audio)"
				+ "\n\nVí dụ:"
				+ "\n   {pn} {{file reset}}: xóa gửi file",
			attachment: [__dirname + "/assets/guide/setleave/guide1.png"]
		}
	},

	onStart: async function ({ args, threadsData, message, event, commandName }) {
		const { threadID, senderID, body } = event;
		const { data } = await threadsData.get(threadID);

		switch (args[0]) {
			case "text": {
				if (!args[1])
					return message.reply("Vui lùng nhập nội dung tin nhắn");
				else if (args[1] == "reset")
					delete data.leaveMessage;
				else
					data.leaveMessage = body.slice(body.indexOf(args[0]) + args[0].length).trim();
				await threadsData.set(threadID, {
					data
				});
				message.reply(data.leaveMessage ? `Đã chỉnh sửa nội dung tin nhắn tạm biệt của nhóm bạn thành: {{${data.leaveMessage}}}` : "Đã reset nội dung tin nhắn tạm biệt");
				break;
			}
			case "file": {
				if (args[1] == "reset") {
					const { leaveAttachment } = data;
					if (!leaveAttachment)
						return message.reply("Không có tệp đính kèm tin nhắn tạm biệt nào để xóa");
					try {
						await Promise.all(data.leaveAttachment.map(fileId => drive.deleteFile(fileId)));
						delete data.leaveAttachment;
					}
					catch (e) { }

					await threadsData.set(threadID, {
						data
					});
					message.reply("Đã reset tệp đính kèm thành công");
				}
				else if (event.attachments.length == 0 && (!event.messageReply || event.messageReply.attachments.length == 0))
					return message.reply("Hãy phản hồi tin nhắn này kèm file ảnh/video/audio", (err, info) => {
						global.GoatBot.onReply.set(info.messageID, {
							messageID: info.messageID,
							author: senderID,
							commandName
						});
					});
				else {
					saveChanges(message, event, threadID, senderID, threadsData);
				}
				break;
			}
			default:
				message.SyntaxError();
				break;
		}
	},

	onReply: async function ({ event, Reply, message, threadsData }) {
		const { threadID, senderID } = event;
		if (senderID != Reply.author)
			return;

		if (event.attachments.length == 0 && (!event.messageReply || event.messageReply.attachments.length == 0))
			return message.reply("Vui lòng reply (phản hồi) tin nhắn có chứa file ảnh/video/audio");
		saveChanges(message, event, threadID, senderID, threadsData);
	}
};

async function saveChanges(message, event, threadID, senderID, threadsData) {
	const { data } = await threadsData.get(threadID);
	const attachments = [...event.attachments, ...(event.messageReply?.attachments || [])];
	if (!data.leaveAttachment)
		data.leaveAttachment = [];

	for (const attachment of attachments) {
		const { url } = attachment;
		const ext = getExtFromUrl(url);
		const fileName = `${getTime()}.${ext}`;
		const infoFile = await drive.uploadFile(`setleave_${threadID}_${senderID}_${fileName}`, await getStreamFromURL(url));
		data.leaveAttachment.push(infoFile.id);
	}
	await threadsData.set(threadID, {
		data
	});
	message.reply(`Đã thêm ${attachments.length} tệp đính kèm vào tin nhắn chào mừng của nhóm bạn`);
}
