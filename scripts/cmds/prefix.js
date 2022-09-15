const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Thay đổi prefix của bot",
		longDescription: "Thay đổi dấu lệnh của bot trong box chat của bạn hoặc cả hệ thống bot (chỉ admin bot)",
		category: "config",
		guide: "{pn} {{<new prefix>}}: thay đổi prefix mới trong box chat của bạn"
			+ "\nVí dụ: {pn} #"
			+ "\n\n{pn} {{<new prefix> -g}}: thay đổi prefix mới trong hệ thống bot (chỉ admin bot)"
			+ "\nVí dụ: {pn} # {{-g}}"
			+ "\n\n{pn} {{reset}}: thay đổi prefix trong box chat của bạn về mặc định"
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData }) {
		if (!args[0])
			return message.SyntaxError();

		if (args[0] == 'reset') {
			const threadData = await threadsData.get(event.threadID);
			delete threadData.data.prefix;
			await threadsData.set(event.threadID, threadData.data, "data");
			return message.reply(`Đã reset prefix về mặc địng: ${global.GoatBot.config.prefix}`);
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-g")
			if (role < 2)
				return message.reply("Chỉ admin mới có thể thay đổi prefix hệ thống bot");
			else
				formSet.setGlobal = true;
		else
			formSet.setGlobal = false;

		return message.reply(`Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix ${args[1] === "-g" ? "của toàn bộ hệ thống bot" : "trong nhóm chat của bạn"}`, (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author)
			return;
		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(`Đã thay đổi prefix hệ thống bot thành: ${newPrefix}`);
		}
		else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(`Đã thay đổi prefix trong nhóm chat của bạn thành: ${newPrefix}`);
		}
	},

	onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "prefix")
			return () => {
				return message.reply(`🌐 Prefix của hệ thống: {{${global.GoatBot.config.prefix}}}\n🛸 Prefix của nhóm bạn: {{${utils.getPrefix(event.threadID)}}}`);
			};
	}
};