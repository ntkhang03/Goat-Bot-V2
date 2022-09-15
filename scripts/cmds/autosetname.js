function checkShortCut(nickname, uid, userName) {
	/\{userName\}/gi.test(nickname) ? nickname = nickname.replace(/\{userName\}/gi, userName) : null;
	/\{userID\}/gi.test(uid) ? nickname = nickname.replace(/\{userID\}/gi, uid) : null;
	return nickname;
}

module.exports = {
	config: {
		name: "autosetname",
		version: "1.0",
		author: "NTKhang",
		cooldowns: 5,
		role: 1,
		shortDescription: "Tự đổi biệt danh tvm",
		longDescription: "Tự đổi biệt danh cho thành viên mới vào nhóm chat",
		category: "box chat",
		guide: '   {pn} {{set <nickname>}}: dùng để cài đặt cấu hình để tự đổi biệt danh, với các shortcut có sẵn:'
			+ '\n   + {userName}: tên thành viên'
			+ '\n   + {userID}: id thành viên'
			+ '\n   Ví dụ: {pn} {{set}} {{{userName}}} 🚀'
			+ '\n\n   {pn} {{[on | off]}}: dùng để bật/tắt tính năng này'
			+ '\n\n   {pn} {{[view | info]}}: hiển thị cấu hình hiện tại'
	},

	onStart: async function ({ message, event, args, threadsData }) {
		switch (args[0]) {
			case "set":
			case "add":
			case "config": {
				if (args.length < 2)
					return message.reply("Vui lòng nhập cấu hình cần thiết");
				const configAutoSetName = args.slice(1).join(" ");
				await threadsData.set(event.threadID, configAutoSetName, "data.autoSetName");
				return message.reply("Cấu hình đã được cài đặt thành công");
			}
			case "view":
			case "info": {
				const configAutoSetName = await threadsData.get(event.threadID, "data.autoSetName");
				return message.reply(configAutoSetName ? `Cấu hình autoSetName hiện tại trong nhóm chat của bạn là:\n${configAutoSetName}` : "Hiện tại nhóm bạn chưa cài đặt cấu hình autoSetName");
			}
			default: {
				const enableOrDisable = args[0];
				if (enableOrDisable !== "on" && enableOrDisable !== "off")
					return message.reply("Vui lòng chọn on hoặc off");
				await threadsData.set(event.threadID, enableOrDisable === "on", "settings.enableAutoSetName");
				return message.reply(`Tính năng autoSetName đã được ${enableOrDisable === "on" ? "bật" : "tắt"} thành công`);
			}
		}
	},

	onEvent: async ({ message, event, api, threadsData }) => {
		if (event.logMessageType !== "log:subscribe")
			return;
		if (!await threadsData.get(event.threadID, "settings.enableAutoSetName"))
			return;
		const configAutoSetName = await threadsData.get(event.threadID, "data.autoSetName");

		return async function () {
			const addedParticipants = [...event.logMessageData.addedParticipants];
			try {
				const { userFbId: uid, fullName: userName } = addedParticipants.splice(-1)[0];
				await api.changeNickname(checkShortCut(configAutoSetName, uid, userName), event.threadID, uid);
			}
			catch (err) {
				return message.reply(`Đã có lỗi xảy ra khi sử dụng chức năng autoSetName, thử tắt tính năng liên kết mời trong nhóm và thử lại sau`);
			}

			for (const user of addedParticipants) {
				const { userFbId: uid, fullName: userName } = user;
				try {
					await api.changeNickname(checkShortCut(configAutoSetName, uid, userName), event.threadID, uid);
				}
				catch (e) {

				}
			}
		};
	}
};