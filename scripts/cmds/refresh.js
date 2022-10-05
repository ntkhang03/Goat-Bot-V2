module.exports = {
	config: {
		name: "refresh",
		version: "1.0",
		author: "NTKhang",
		countDown: 60,
		role: 0,
		shortDescription: "làm mới thông tin",
		longDescription: "làm mới thông tin nhóm chat hoặc người dùng",
		category: "box chat",
		guide: "   {pn} {{[thread | group]}}: làm mới thông tin nhóm chat của bạn"
			+ "\n   {pn} {{group}} <threadID>: làm mới thông tin nhóm chat theo ID"
			+ "\n\n   {pn} {{user}}: làm mới thông tin người dùng của bạn"
			+ "\n   {pn} {{user}} [<userID> | @tag]: làm mới thông tin người dùng theo ID"
	},

	onStart: async function ({ args, threadsData, message, event, usersData }) {
		if (args[0] == "group" || args[0] == "thread") {
			const targetID = args[1] || event.threadID;
			try {
				await threadsData.refreshInfo(targetID);
				return message.reply(`✅ | Đã làm mới thông tin nhóm chat ${targetID == event.threadID ? "của bạn" : targetID} thành công!`);
			}
			catch (error) {
				return message.reply(`❌ | Đã xảy ra lỗi không thể làm mới thông tin nhóm chat ${targetID == event.threadID ? "của bạn" : targetID}`);
			}
		}
		else if (args[0] == "user") {
			let targetID = event.senderID;
			if (args[1]) {
				if (Object.keys(event.mentions).length)
					targetID = Object.keys(event.mentions)[0];
				else
					targetID = args[1];
			}
			try {
				await usersData.refreshInfo(targetID);
				return message.reply(`✅ | Đã làm mới thông tin người dùng ${targetID == event.senderID ? "của bạn" : targetID} thành công!`);
			}
			catch (error) {
				return message.reply(`❌ | Đã xảy ra lỗi không thể làm mới thông tin người dùng ${targetID == event.senderID ? "của bạn" : targetID}`);
			}
		}
		else
			message.SyntaxError();
	}
};