module.exports = {
	config: {
		name: "count",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Xem tin nhắn nhóm",
		longDescription: "Xem số lượng tin nhắn của tất cả thành viên hoặc bản thân (tính từ lúc bot vào nhóm)",
		category: "box chat",
		guide: "{pn}: dùng để xem số lượng tin nhắn của bạn"
			+ "\n{pn} {{@tag}}: dùng để xem số lượng tin nhắn của những người được tag"
			+ "\n{pn} {{all}}: dùng để xem số lượng tin nhắn của tất cả thành viên"
	},

	onStart: async function ({ args, threadsData, message, event, api, commandName }) {
		const { threadID, senderID } = event;
		const threadData = await threadsData.get(threadID);
		const { members } = threadData;
		const usersInGroup = (await api.getThreadInfo(threadID)).participantIDs;
		let arraySort = [];
		for (const user of members) {
			if (!usersInGroup.includes(user.userID))
				continue;
			const charac = "️️️️️️️️️️️️️️️️️"; // This character is banned from facebook chat (it is not an empty string)
			arraySort.push({
				name: user.name.includes(charac) ? `Uid: ${user.userID}` : user.name,
				count: user.count,
				uid: user.userID
			});
		}
		let stt = 1;
		arraySort.sort((a, b) => b.count - a.count);
		arraySort.map(item => item.stt = stt++);

		if (args[0]) {
			if (args[0].toLowerCase() == "all") {
				let msg = "Số tin nhắn của các thành viên:\n";
				const endMessage = "\n\nNhững người không có tên trong danh sách là chưa gửi tin nhắn nào";
				for (const item of arraySort) {
					if (item.count > 0)
						msg += `\n${item.stt}/ {{${item.name}}}: {{${item.count}}}`;
				}

				if ((msg + endMessage).length > 19999) {
					msg = "";
					let page = parseInt(args[1]);
					if (isNaN(page))
						page = 1;
					const splitPage = global.utils.splitPage(arraySort, 50);
					arraySort = splitPage.allPage[page - 1];
					for (const item of arraySort) {
						if (item.count > 0)
							msg += `\n${item.stt}/ {{${item.name}}}: {{${item.count}}}`;
					}
					msg += `Trang [1/${splitPage.totalPage}]\n${endMessage}\nPhản hồi tin nhắn này kèm số trang để xem tiếp`;
					return message.reply(msg, (err, info) => {
						if (err)
							return message.err(err);
						global.GoatBot.onReply.set(info.messageID, {
							commandName,
							messageID: info.messageID,
							splitPage,
							author: senderID
						});
					});
				}
				message.reply(msg + endMessage);
			}
			else if (event.mentions) {
				let msg = "";
				for (const id in event.mentions) {
					const findUser = arraySort.find(item => item.uid == id);
					msg += `\n{{${findUser.name}}} hạng ${findUser.stt} với ${findUser.count} tin nhắn`;
				}
				message.reply(msg);
			}
		}
		else {
			const findUser = arraySort.find(item => item.uid == senderID);
			return message.reply(`Bạn đứng hạng ${findUser.stt} và đã gửi ${findUser.count} tin nhắn trong nhóm này`);
		}
	},

	onReply: ({ message, event, Reply, commandName }) => {
		const { senderID, body } = event;
		const { author, splitPage } = Reply;
		if (author != senderID)
			return;
		const page = parseInt(body);
		if (isNaN(page) || page < 1 || page > splitPage.totalPage)
			return message.reply("Số trang không hợp lệ");
		let msg = "Số tin nhắn của các thành viên:\n";
		const endMessage = "\n\nNhững người không có tên trong danh sách là chưa gửi tin nhắn nào";
		const arraySort = splitPage.allPage[page - 1];
		for (const item of arraySort) {
			if (item.count > 0)
				msg += `\n${item.stt}/ {{${item.name}}}: ${item.count}`;
		}
		msg += `${endMessage}\nTrang [${page}/${splitPage.totalPage}]`;
		message.reply(msg + "\nPhản hồi tin nhắn này kèm số trang để xem tiếp", (err, info) => {
			if (err)
				return message.err(err);
			message.unsend(Reply.messageID);
			global.GoatBot.onReply.set(info.messageID, {
				commandName,
				messageID: info.messageID,
				splitPage,
				author: senderID
			});
		});
	},

	onChat: async ({ usersData, threadsData, event }) => {
		const { senderID, threadID } = event;
		const { members } = await threadsData.get(threadID);
		const findMember = members.find(user => user.userID == senderID);
		if (!findMember) {
			members.push({
				userID: senderID,
				name: await usersData.getName(senderID),
				nickname: null,
				inGroup: true,
				count: 1
			});
		}
		else
			findMember.count += 1;
		await threadsData.set(threadID, { members });
	}

};
