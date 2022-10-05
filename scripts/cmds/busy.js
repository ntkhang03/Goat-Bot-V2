if (!global.client.busyList)
	global.client.busyList = {};

module.exports = {
	config: {
		name: "busy",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "bật chế độ không làm phiền",
		longDescription: "bật chế độ không làm phiền, khi bạn được tag bot sẽ thông báo",
		category: "box chat",
		guide: "   {pn} [để trống | <lý do>]: bật chế độ không làm phiền"
			+ "\n   {pn} off: tắt chế độ không làm phiền"
	},

	onStart: async function ({ args, message, event }) {
		const { senderID } = event;

		if (args[0] == "off") {
			delete global.client.busyList[senderID];
			return message.reply("✅ | Đã tắt chế độ không làm phiền");
		}

		const reason = args.join(" ") || null;
		global.client.busyList[senderID] = reason;

		return message.reply(`✅ | Đã bật chế độ không làm phiền${reason ? ` với lý do: ${reason}` : ""}`);
	},

	onChat: async ({ event, message }) => {
		if (!global.client.busyList) return;
		const { mentions } = event;
		const { busyList } = global.client;

		if (!mentions || Object.keys(mentions).length == 0)
			return;
		const arrayMentions = Object.keys(mentions);

		for (const userID of arrayMentions) {
			if (Object.keys(global.client.busyList).includes(userID))
				return message.reply(`Hiện tại người dùng ${mentions[userID].replace("@", "")} đang bận${busyList[userID] ? ` với lý do: ${busyList[userID]}` : ""}`);
		}
	}
};