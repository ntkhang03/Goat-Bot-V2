module.exports = {
	config: {
		name: "balance",
		aliases: ["bal", "coin", "money"],
		version: "1.3",
		author: "NTKhang",
		contributors: {
			lianecagara:
				"Added an option to check balance by just replying.\n" +
				"Added more aliases :)" +
				"Simplified statement Object.keys(event.mentions).length > 0 to Object.keys(event.mentions).length\n" +
				"Improved syntax by using shorthand object method syntax instead of function expression.\n" +
				"Raised Cooldown from 5 to 7",
		},
		countDown: 7,
		role: 0,
		description: {
			vi: "xem số tiền hiện có của bạn hoặc người được tag",
			en: "view your money or the money of the tagged person",
		},
		category: "economy",
		guide: {
			vi:
				"   {pn}: xem số tiền của bạn" +
				"\n   {pn} <@tag/reply>: xem số tiền của người được tag/reply",
			en:
				"   {pn}: view your money" +
				"\n   {pn} <@tag/reply>: view the money of the tagged/replied person",
		},
	},

	langs: {
		vi: {
			money: "Bạn đang có %1$",
			moneyOf: "%1 đang có %2$",
		},
		en: {
			money: "You have %1$",
			moneyOf: "%1 has %2$",
		},
	},

	async onStart({ message, usersData, event, getLang }) {
		if (Object.keys(event.mentions).length) {
			const uids = Object.keys(event.mentions);
			let msg = "";
			for (const uid of uids) {
				const userMoney = await usersData.get(uid, "money");
				msg +=
					getLang("moneyOf", event.mentions[uid].replace("@", ""), userMoney) +
					"\n";
			}
			return message.reply(msg);
		}
		if (event.messageReply) {
			const userData = await usersData.get(event.messageReply.senderID);
			return message.reply(getLang("moneyOf", userData.name, userData.money));
		}
		const userData = await usersData.get(event.senderID);
		message.reply(getLang("money", userData.money));
	},
};
