const { drive, getStreamFromURL, getExtFromUrl, getTime } = global.utils;

module.exports = {
	config: {
		name: "setwelcome",
		aliases: ["setwc"],
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 1,
		shortDescription: "chỉnh sửa nội dung tin nhắn chào mừng",
		longDescription: "chỉnh sửa nội dung tin nhắn chào mừng thành viên mới tham gia vào nhóm chat của bạn",
		category: "custom",
		guide: {
			body: "{pn} text [<nội dung> | {{reset}}]: chỉnh sửa nội dung văn bản hoặc reset về mặc định, với những shortcut có sẵn:"
				+ "\n  + {{{userName}}}: tên của thành viên mới"
				+ "\n  + {{{userNameTag}}}: tên của thành viên mới (tag)"
				+ "\n  + {{{boxName}}}:  tên của nhóm chat"
				+ "\n  + {{{multiple}}}: bạn || các bạn"
				+ "\n  + {{{session}}}:  buổi trong ngày"
				+ "\n\nVí dụ:"
				+ "\n   {pn} text Hello {{{userName}}}, welcome to {{{boxName}}}, chúc {{{multiple}}} một ngày mới vui vẻ"
				+ "\n"
				+ "\nReply (phản hồi) hoặc gửi kèm một tin nhắn có file với nội dung {pn} {{file}}: để thêm tệp đính kèm vào tin nhắn chào mừng (ảnh, video, audio)"
				+ "\n\nVí dụ:"
				+ "\n   {pn} {{file reset}}: xóa gửi file",
			attachment: [__dirname + "/assets/guide/setwelcome/guide1.png"]
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
					delete data.welcomeMessage;
				else
					data.welcomeMessage = body.slice(body.indexOf(args[0]) + args[0].length).trim();
				await threadsData.set(threadID, {
					data
				});
				message.reply(data.welcomeMessage ? `Đã chỉnh sửa nội dung tin nhắn chào mừng của nhóm bạn thành: {{${data.welcomeMessage}}}` : "Đã reset nội dung tin nhắn chào mừng");
				break;
			}
			case "file": {
				if (args[1] == "reset") {
					const { welcomeAttachment } = data;
					if (!welcomeAttachment)
						return message.reply("Không có tệp đính kèm tin nhắn chào mừng nào để xóa");
					try {
						await Promise.all(data.welcomeAttachment.map(fileId => drive.deleteFile(fileId)));
						delete data.welcomeAttachment;
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
	if (!data.welcomeAttachment)
		data.welcomeAttachment = [];

	for (const attachment of attachments) {
		const { url } = attachment;
		const ext = getExtFromUrl(url);
		const fileName = `${getTime()}.${ext}`;
		const infoFile = await drive.uploadFile(`setwelcome_${threadID}_${senderID}_${fileName}`, await getStreamFromURL(url));
		data.welcomeAttachment.push(infoFile.id);
	}
	await threadsData.set(threadID, {
		data
	});
	message.reply(`Đã thêm ${attachments.length} tệp đính kèm vào tin nhắn chào mừng của nhóm bạn`);
}
