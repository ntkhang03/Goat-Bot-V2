if (!global.client.busyList)
	global.client.busyList = {};

module.exports = {
	config: {
		name: "busy",
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "bật chế độ không làm phiền",
			en: "turn on do not disturb mode"
		},
		longDescription: {
			vi: "bật chế độ không làm phiền, khi bạn được tag bot sẽ thông báo",
			en: "turn on do not disturb mode, when you are tagged bot will notify"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} [để trống | <lý do>]: bật chế độ không làm phiền"
				+ "\n   {pn} off: tắt chế độ không làm phiền",
			en: "   {pn} [empty | <reason>]: turn on do not disturb mode"
				+ "\n   {pn} off: turn off do not disturb mode"
		}
	},

	langs: {
		vi: {
			turnedOff: "✅ | Đã tắt chế độ không làm phiền",
			turnedOn: "✅ | Đã bật chế độ không làm phiền",
			turnedOnWithReason: "✅ | Đã bật chế độ không làm phiền với lý do: %1",
			alreadyOn: "Hiện tại người dùng %1 đang bận",
			alreadyOnWithReason: "Hiện tại người dùng %1 đang bận với lý do: %2"
		},
		en: {
			turnedOff: "✅ | Do not disturb mode has been turned off",
			turnedOn: "✅ | Do not disturb mode has been turned on",
			turnedOnWithReason: "✅ | Do not disturb mode has been turned on with reason: %1",
			alreadyOn: "User %1 is currently busy",
			alreadyOnWithReason: "User %1 is currently busy with reason: %2"
		}
	},

	onStart: async function ({ args, message, event, getLang }) {
		const { senderID } = event;

		if (args[0] == "off") {
			delete global.client.busyList[senderID];
			return message.reply("✅ | Đã tắt chế độ không làm phiền");
		}

		const reason = args.join(" ") || null;
		global.client.busyList[senderID] = reason;
		return message.reply(
			reason ?
				getLang("withReason", reason) :
				getLang("turnedOnWithReason")
		);
	},

	onChat: async ({ event, message, getLang }) => {
		if (!global.client.busyList) return;
		const { mentions } = event;
		const { busyList } = global.client;

		if (!mentions || Object.keys(mentions).length == 0)
			return;
		const arrayMentions = Object.keys(mentions);

		for (const userID of arrayMentions) {
			if (global.client.busyList.hasOwnProperty(userID)) {
				return message.reply(
					busyList[userID] ?
						getLang("alreadyOnWithReason", mentions[userID].replace("@", ""), busyList[userID]) :
						getLang("alreadyOn", mentions[userID].replace("@", "")));
			}
		}
	}
};