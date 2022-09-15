module.exports = {
	config: {
		name: "balance",
		aliases: ["bal"],
		version: "1.0.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "xem số tiền của bạn",
		longDescription: "xem số tiền hiện có của bạn hoặc người được tag",
		category: "economy",
		guide: "{pn}"
	},

	onStart: async function ({ message, usersData, event }) {
		if (Object.keys(event.mentions).length > 0) {
			const uids = Object.keys(event.mentions);
			let msg = "";
			for (const uid of uids) {
				const userMoney = await usersData.get(uid, "money");
				msg += `${event.mentions[uid].replace("@", "")} có ${userMoney} đ\n`;
			}
			return message.reply(msg);
		}
		const userData = await usersData.get(event.senderID);
		message.reply(`Bạn đang có ${userData.money} đ`);
	}
};