const deltaNext = global.GoatBot.configCommands.envCommands.rank.deltaNext;
const expToLevel = exp => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);

module.exports = {
	config: {
		name: "rankup",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Bật/tắt thông báo level up",
		longDescription: "Bật/tắt thông báo level up",
		category: "rank",
		guide: "{pn} {{[on | off]}}",
		envConfig: {
			deltaNext: 5
		}
	},

	onStart: async function ({ message, event, threadsData, args }) {
		if (!["on", "off"].includes(args[0]))
			return message.reply("Vui lòng chọn {{`on`}} hoặc {{`off`}}");
		await threadsData.set(event.threadID, args[0] === "on", "settings.sendRankupMessage");
		return message.reply(`Đã ${args[0] === "on" ? "bật" : "tắt"} thông báo level up`);
	},

	onChat: async function ({ threadsData, usersData, event, message }) {
		const sendRankupMessage = await threadsData.get(event.threadID, "settings.sendRankupMessage");
		if (!sendRankupMessage)
			return;
		const { exp } = await usersData.get(event.senderID);
		if (expToLevel(exp) > expToLevel(exp - 1)) {
			message.reply(`{{🎉🎉 chúc mừng bạn đạt level ${expToLevel(exp)}}}`);
		}
	}
};
