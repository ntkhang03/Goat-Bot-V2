module.exports = {
	config: {
		name: "filteruser",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "lọc thành viên nhóm",
		longDescription: "lọc thành viên nhóm theo số tin nhắn hoặc bị khóa acc",
		category: "box chat",
		guide: "{pn} [<số tin nhắn> | {{die}}]"
	},

	onStart: async function ({ api, args, threadsData, message, event, commandName }) {
		const threadData = await threadsData.get(event.threadID);
		if (!threadData.adminIDs.includes(api.getCurrentUserID()))
			return message.reply("⚠️ | Vui lòng thêm bot làm quản trị viên của box để sử dụng lệnh này");

		if (!isNaN(args[0])) {
			message.reply(`⚠️ | Bạn có chắc chắn muốn xóa thành viên nhóm có số tin nhắn nhỏ hơn ${args[0]} không?\nThả cảm xúc bất kì vào tin nhắn này để xác nhận`, (err, info) => {
				global.GoatBot.onReaction.set(info.messageID, {
					author: event.senderID,
					messageID: info.messageID,
					minimum: Number(args[0]),
					commandName
				});
			});
		}
		else if (args[0] == "die") {
			const threadData = await api.getThreadInfo(event.threadID);
			const membersBlocked = threadData.userInfo.filter(user => user.type !== "User").map(user => user.id);
			const errors = [];
			const success = [];
			for (const user of membersBlocked) {
				if (user.type !== "User") {
					try {
						await api.removeUserFromGroup(user.id, event.threadID);
						success.push(user.id);
					}
					catch (e) {
						errors.push(user.name);
					}
				}
			}
			message.reply(
				membersBlocked.length > 0 ?
					(success.length ? `✅ | Đã xóa thành công ${success.length} thành viên bị khóa acc` : '') + (errors.length > 0 ? `\n❌ | Đã xảy ra lỗi không thể kick ${errors.length} thành viên:\n${errors.join("\n")}` : '')
					: "✅ | Không có thành viên nào bị khóa acc"
			);
		}
		else
			message.SyntaxError();
	},

	onReaction: async function ({ api, Reaction, event, threadsData, message }) {
		const { minimum = 1 } = Reaction;
		const threadData = await threadsData.get(event.threadID);
		const botID = api.getCurrentUserID();
		const membersCountLess = threadData.members.filter(member => member.count < minimum && member.inGroup == true && member.userID != botID);
		const errors = [];
		const success = [];
		for (const member of membersCountLess) {
			try {
				await api.removeUserFromGroup(member.userID, event.threadID);
				success.push(member.userID);
			}
			catch (e) {
				errors.push(member.name);
			}
		}
		message.reply(
			membersCountLess.length > 0 ?
				(success.length ? `✅ | Đã xóa thành công ${success.length} thành viên có số tin nhắn ít hơn ${minimum}` : '') + (errors.length > 0 ? `\n❌ | Đã xảy ra lỗi không thể kick ${errors.length} thành viên:\n${errors.join("\n")}` : '')
				: `✅ | Không có thành viên nào có số tin nhắn ít hơn ${minimum}`
		);
	}
};