const { getExtFromUrl, drive, getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: 'shortcut',
		aliases: ['short'],
		version: '1.0',
		author: 'NTKhang',
		countDown: 5,
		role: 0,
		shortDescription: 'Thêm một phím tắt cho bạn',
		longDescription: 'Thêm một phím tắt cho tin nhắn trong nhóm chat của bạn',
		category: 'custom',
		guide: {
			body: '   {pn} {{add <word> => <content>}}: thêm một phím tắt cho bạn (có thể gửi kèm hoặc phản hồi một tin nhắn có file để thêm tệp đính kèm)'
				+ '\n   Ví dụ: {{{pn} add hi}} => Xin chào mọi người'
				+ '\n'
				+ '\n   {pn} {{del <word>}}: xóa một phím tắt'
				+ '\n   Ví dụ: {pn} {{del hi}}'
				+ '\n'
				+ '\n   {pn} {{reomve}}: xóa bỏ tất cả các phím tắt trong nhóm chat của bạn'
				+ '\n'
				+ '\n   {pn} {{list}}: xem danh sách các phím tắt của bạn'
		}
	},

	onStart: async function ({ args, threadsData, message, event, role, usersData }) {
		const { threadID, senderID } = event;
		const dataShortcut = await threadsData.get(threadID, 'data.shortcut', []);

		switch (args[0]) {
			case 'add': {
				const [key, content] = args.slice(1).join(' ").split("=>');
				const attachments = [...event.attachments, ...(event.messageReply ? event.messageReply.attachments : [])];
				if (!key || !content && attachments.length === 0)
					return message.reply('Vui lòng nhập nội dung tin nhắn');
				const attachmentIDs = [];
				if (attachments.length > 0) {
					for (const attachment of attachments) {
						const ext = getExtFromUrl(attachment.url);
						const fileName = `${Date.now()}.${ext}`;
						const infoFile = await drive.uploadFile(`shortcut_${threadID}_${senderID}_${fileName}`, await getStreamFromURL(attachment.url));
						attachmentIDs.push(infoFile.id);
					}
				}
				dataShortcut.push({
					key: key.trim().toLowerCase(),
					content,
					attachments: attachmentIDs, author: senderID
				});
				await threadsData.set(threadID, dataShortcut, 'data.shortcut');
				message.reply(`Đã thêm shortcut {{${key} => ${content}}}${attachments.length > 0 ? ` với ${attachments.length} tệp đính kèm` : ''}`);
				break;
			}
			case 'del': {
				const key = args.slice(1).join(' ');
				if (!key)
					return message.reply('Vui lòng nhập từ khóa của shortcut muốn xóa');
				const index = dataShortcut.findIndex(x => x.key === key);
				if (index === -1)
					return message.reply(`Không tìm thấy shortcut nào cho từ khóa {{'${key}'}} trong nhóm chat của bạn`);
				if (senderID != dataShortcut[index].author && role < 1)
					return message.reply('Chỉ quản trị viên mới có thể xóa shortcut của người khác');
				dataShortcut.splice(index, 1);
				await threadsData.set(threadID, dataShortcut, 'data.shortcut');
				message.reply(`Đã xóa shortcut {{'${key}'}}`);
				break;
			}
			case 'list': {
				if (dataShortcut.length === 0)
					return message.reply('Nhóm chat của bạn chưa thêm shortcut nào');
				const list = (await Promise.all(dataShortcut.map(async x => `[+] {{${x.key}}} => với ${x.content ? 1 : 0} tin nhắn${x.attachments.length > 0 ? ` và ${x.attachments.length} tệp đính kèm` : ''} {{(${await usersData.getName(x.author)})}}`))).join('\n');
				message.reply(`Danh sách các shortcut của nhóm bạn:\n${list}`);
				break;
			}
			case 'remove': {
				if (threadID != senderID && role < 1)
					return message.reply('Chỉ quản trị viên mới có thể xóa tất cả các shortcut trong nhóm chat');
				await threadsData.set(threadID, 'data.shortcut', []);
				message.reply('Đã xóa tất cả các shortcut trong nhóm chat của bạn');
				break;
			}
			default:
				message.SyntaxError();
				break;
		}
	},

	onChat: async ({ threadsData, message, event }) => {
		const { threadID } = event;
		const body = (event.body || '').toLowerCase();
		const dataShortcut = await threadsData.get(threadID, 'data.shortcut', []);
		const findShortcut = dataShortcut.find(x => x.key === body);
		let attachments = [];
		if (findShortcut) {
			if (findShortcut.attachments.length > 0) {
				for (const id of findShortcut.attachments)
					attachments.push(drive.getFile(id, 'stream', true));
				attachments = await Promise.all(attachments);
			}

			message.reply({
				body: findShortcut.content,
				attachment: attachments
			});
		}
	}
};