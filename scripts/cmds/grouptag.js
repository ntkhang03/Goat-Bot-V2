module.exports = {
	config: {
		name: "grouptag",
		aliases: ["grtag"],
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Tag theo nhóm",
		longDescription: "Tag thành viên theo nhóm",
		category: "info",
		guide: "  {pn} {{add <groupTagName> <@tags>}}: dùng để thêm nhóm tag mới hoặc thêm thành viên vào nhóm tag đã có"
			+ "\n   Ví dụ: {{{pn} TEAM1 @tag1 @tag2}}"
			+ "\n\n   {pn} {{del <groupTagName> <@tags>}}: dùng để xóa các thành viên được tag khỏi nhóm tag {{<groupTagName>}}"
			+ "\n   Ví dụ: {{{pn} del TEAM1 @tag1 @tag2}}"
			+ "\n\n   {pn} {{remove <groupTagName>}}: dùng để xóa nhóm tag"
			+ "\n   Ví dụ: {{{pn} remove TEAM1}}"
			+ "\n\n   {pn} {{rename <groupTagName> | <newGroupTagName>}}: dùng để đổi tên nhóm tag"
			+ "\n\n   {pn} {{[list | all]}}: dùng để xem danh sách các nhóm tag trong nhóm chat của bạn"
	},

	onStart: async function ({ message, event, args, threadsData }) {
		const { threadID, mentions } = event;
		for (const uid in mentions)
			mentions[uid] = mentions[uid].replace("@", "");
		const groupTags = await threadsData.get(threadID, "data.groupTags", []);

		switch (args[0]) {
			case "add": {
				const mentionsID = Object.keys(event.mentions);
				const content = (args.slice(1) || []).join(" ");
				const groupTagName = content.slice(0, content.indexOf(event.mentions[mentionsID[0]]) - 1).trim();
				if (!groupTagName)
					return message.reply("Vui lòng nhập tên nhóm tag");
				if (mentionsID.length === 0)
					return message.reply("Bạn chưa tag thành viên nào");

				const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
				if (oldGroupTag) {
					const usersIDExist = [];
					const usersIDNotExist = [];
					for (const uid in mentions) {
						if (oldGroupTag.users.hasOwnProperty(uid)) {
							usersIDExist.push(uid);
						}
						else {
							oldGroupTag.users[uid] = mentions[uid];
							usersIDNotExist.push(uid);
						}
					}
					await threadsData.set(threadID, groupTags, "data.groupTags");
					message.reply(
						(usersIDNotExist.length > 0 ? `Đã thêm thành viên {{${usersIDNotExist.map(uid => `${mentions[uid]}`).join(", ")}}} vào nhóm tag {{"${groupTagName}"}}` : "")
						+ (usersIDExist.length > 0 ? `\n{{${usersIDExist.map(uid => `${mentions[uid]}`).join(", ")}}} đã tồn tại trong nhóm tag {{"${groupTagName}"}} trước đó rồi` : "")
					);
				}
				else {
					const newGroupTag = {
						name: groupTagName,
						users: mentions
					};
					groupTags.push(newGroupTag);
					await threadsData.set(threadID, groupTags, "data.groupTags");
					message.reply(`Đã thêm nhóm tag mới {{"${groupTagName}"}} với những thành viên sau: {{${Object.values(mentions).map(name => name).join(", ")}}}`);
				}
				break;
			}
			case "list":
			case "all": {
				const msg = groupTags.reduce((msg, group) => msg + `\n\n{{${group.name}}}:\n {{${Object.values(group.users).map(name => name).join("\n ")}}}`, "");
				message.reply(msg || "Box chat của bạn chưa thêm nhóm tag nào");
				break;
			}
			case "del": {
				const content = (args.slice(1) || []).join(" ");
				const mentionsID = Object.keys(event.mentions);
				const groupTagName = content.slice(0, content.indexOf(mentions[mentionsID[0]]) - 1).trim();
				if (!groupTagName)
					return message.reply("Vui lòng nhập tên nhóm tag muốn xóa thành viên");
				if (mentionsID.length === 0)
					return message.reply(`Vui lòng tag thành viên muốn xóa khỏi nhóm tag {{"${groupTagName}"}}`);
				const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
				if (!oldGroupTag)
					return message.reply(`Nhóm tag {{"${groupTagName}"}} không tồn tại`);
				const usersIDExist = [];
				const usersIDNotExist = [];
				for (const uid in mentions) {
					if (oldGroupTag.users.hasOwnProperty(uid)) {
						delete oldGroupTag.users[uid];
						usersIDExist.push(uid);
					}
					else {
						usersIDNotExist.push(uid);
					}
				}
				await threadsData.set(threadID, groupTags, "data.groupTags");
				message.reply(
					(usersIDExist.length > 0 ? `Đã xóa thành viên {{${usersIDExist.map(uid => `${mentions[uid]}`).join(", ")}}} khỏi nhóm tag {{"${groupTagName}"}}` : "")
					+ (usersIDNotExist.length > 0 ? `\n{{${usersIDNotExist.map(uid => `${mentions[uid]}`).join(", ")}}} không tồn tại trong nhóm tag {{"${groupTagName}"}}` : "")
				);
				break;
			}
			case "remove":
			case "rm": {
				const content = (args.slice(1) || []).join(" ");
				const groupTagName = content.trim();
				if (!groupTagName)
					return message.reply("Vui lòng nhập tên nhóm tag muốn xóa");
				const index = groupTags.findIndex(group => group.name.toLowerCase() === groupTagName.toLowerCase());
				if (index === -1)
					return message.reply(`Nhóm tag {{"${groupTagName}"}} không tồn tại`);
				groupTags.splice(index, 1);
				await threadsData.set(threadID, groupTags, "data.groupTags");
				message.reply(`Đã xóa nhóm tag {{"${groupTagName}"}} khỏi box chat của bạn`);
				break;
			}
			case "tag": {
				const content = (args.slice(1) || []).join(" ");
				const groupTagName = content.trim();
				if (!groupTagName)
					return message.reply("Vui lòng nhập tên nhóm tag muốn tag");
				const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
				if (!oldGroupTag)
					return message.reply(`Nhóm tag {{"${groupTagName}"}} không tồn tại`);
				const { users } = oldGroupTag;
				const mentions = [];
				let msg = "";
				for (const uid in users) {
					const userName = users[uid];
					mentions.push({
						id: uid,
						tag: userName
					});
					msg += `{{${userName}}}\n`;
				}
				message.reply({
					body: `Tag nhóm {{"${groupTagName}"}}:\n${msg}`,
					mentions
				});
				break;
			}
			case "rename": {
				const content = (args.slice(1) || []).join(" ");
				const [oldGroupTagName, newGroupTagName] = content.split("|").map(str => str.trim());
				if (!oldGroupTagName || !newGroupTagName)
					return message.reply("Vui lòng nhập tên nhóm tag cũ và tên mới");
				const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === oldGroupTagName.toLowerCase());
				if (!oldGroupTag)
					return message.reply(`Nhóm tag {{"${oldGroupTagName}"}} không tồn tại`);
				oldGroupTag.name = newGroupTagName;
				await threadsData.set(threadID, groupTags, "data.groupTags");
				message.reply(`Đã đổi tên nhóm tag {{"${oldGroupTagName}"}} thành {{"${newGroupTagName}"}}`);
				break;
			}
			default: {
				message.SyntaxError();
			}
		}
	}
};