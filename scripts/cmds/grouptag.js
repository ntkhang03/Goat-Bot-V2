module.exports = {
	config: {
		name: "grouptag",
		aliases: ["grtag"],
		version: "1.3",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Tag theo nhóm",
			en: "Tag by group"
		},
		longDescription: {
			vi: "Tag thành viên theo nhóm",
			en: "Tag members by group"
		},
		category: "info",
		guide: {
			vi: "   {pn} add <groupTagName> <@tags>: dùng để thêm nhóm tag mới hoặc thêm thành viên vào nhóm tag đã có"
				+ "\n   Ví dụ:"
				+ "\n    {pn} TEAM1 @tag1 @tag2"
				+ "\n\n   {pn} del <groupTagName> <@tags>: dùng để xóa các thành viên được tag khỏi nhóm tag <groupTagName>"
				+ "\n   Ví dụ:"
				+ "\n    {pn} del TEAM1 @tag1 @tag2"
				+ "\n\n   {pn} remove <groupTagName>: dùng để xóa nhóm tag"
				+ "\n   Ví dụ:"
				+ "\n    {pn} remove TEAM1"
				+ "\n\n   {pn} rename <groupTagName> | <newGroupTagName>: dùng để đổi tên nhóm tag"
				+ "\n\n   {pn} [list | all]: dùng để xem danh sách các nhóm tag trong nhóm chat của bạn"
				+ "\n\n   {pn} info <groupTagName>: dùng để xem thông tin của nhóm tag",
			en: "   {pn} add <groupTagName> <@tags>: use to add new group tag or add members to group tag"
				+ "\n   Example:"
				+ "\n    {pn} TEAM1 @tag1 @tag2"
				+ "\n\n   {pn} del <groupTagName> <@tags>: use to remove members from group tag"
				+ "\n   Example:"
				+ "\n    {pn} del TEAM1 @tag1 @tag2"
				+ "\n\n   {pn} remove <groupTagName>: use to remove group tag"
				+ "\n   Example:"
				+ "\n    {pn} remove TEAM1"
				+ "\n\n   {pn} rename <groupTagName> | <newGroupTagName>: use to rename group tag"
				+ "\n\n   {pn} [list | all]: use to view list of group tag in your group chat"
				+ "\n\n   {pn} info <groupTagName>: use to view info of group tag"
		}
	},

	langs: {
		vi: {
			noGroupTagName: "Vui lòng nhập tên nhóm tag",
			noMention: "Bạn chưa tag thành viên nào để thêm vào nhóm tag",
			addedSuccess: "Đã thêm các thành viên sau vào nhóm tag \"%1\":\n%2",
			addedSuccess2: "Đã thêm nhóm tag \"%1\" với các thành viên sau:\n%2",
			existedInGroupTag: "Các thành viên sau:\n%1\nđã có trong nhóm tag \"%2\" từ trước",
			notExistedInGroupTag: "Các thành viên sau:\n%1\nkhông có trong nhóm tag \"%2\"",
			noExistedGroupTag: "Nhóm tag \"%1\" không tồn tại trong box chat của bạn",
			noExistedGroupTag2: "Box chat của bạn chưa thêm nhóm tag nào",
			noMentionDel: "Vui lòng tag thành viên muốn xóa khỏi nhóm tag \"%1\"",
			deletedSuccess: "Đã xóa các thành viên sau:\n%1\nkhỏi nhóm tag \"%2\"",
			deletedSuccess2: "Đã xóa nhóm tag \"%1\"",
			tagged: "Tag nhóm \"%1\":\n%2",
			noGroupTagName2: "Vui lòng nhập tên nhóm tag cũ và tên mới, cách nhau bằng dấu \"|\"",
			renamedSuccess: "Đã đổi tên nhóm tag \"%1\" thành \"%2\"",
			infoGroupTag: "📑 | Tên nhóm: %1\n👥 | Số thành viên: %2\n👨‍👩‍👧‍👦 | Danh sách thành viên:\n %3"
		},
		en: {
			noGroupTagName: "Please enter group tag name",
			noMention: "You haven't tagged any member to add to group tag",
			addedSuccess: "Added members to group tag \"%1\":\n%2",
			addedSuccess2: "Added group tag \"%1\" with members:\n%2",
			existedInGroupTag: "Members:\n%1\nalready existed in group tag \"%2\"",
			notExistedInGroupTag: "Members:\n%1\ndoesn't exist in group tag \"%2\"",
			noExistedGroupTag: "Group tag \"%1\" doesn't exist in your group chat",
			noExistedGroupTag2: "Your group chat hasn't added any group tag",
			noMentionDel: "Please tag members to remove from group tag \"%1\"",
			deletedSuccess: "Deleted members:\n%1\nfrom group tag \"%2\"",
			deletedSuccess2: "Deleted group tag \"%1\"",
			tagged: "Tag group \"%1\":\n%2",
			noGroupTagName2: "Please enter old group tag name and new group tag name, separated by \"|\"",
			renamedSuccess: "Renamed group tag \"%1\" to \"%2\"",
			infoGroupTag: "📑 | Group name: %1\n👥 | Number of members: %2\n👨‍👩‍👧‍👦 | List of members:\n %3"
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang }) {
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
					return message.reply(getLang("noGroupTagName"));
				if (mentionsID.length === 0)
					return message.reply(getLang("noMention"));

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

					let msg = "";
					if (usersIDNotExist.length > 0)
						msg += getLang("addedSuccess", oldGroupTag.name, usersIDNotExist.map(uid => mentions[uid]).join("\n")) + "\n";
					if (usersIDExist.length > 0)
						msg += getLang("existedInGroupTag", usersIDExist.map(uid => mentions[uid]).join("\n"));
					message.reply(msg);
				}
				else {
					const newGroupTag = {
						name: groupTagName,
						users: mentions
					};
					groupTags.push(newGroupTag);
					await threadsData.set(threadID, groupTags, "data.groupTags");
					message.reply(getLang("addedSuccess2", groupTagName, Object.values(mentions).join("\n")));
				}
				break;
			}
			case "list":
			case "all": {
				if (args[1]) {
					const groupTagName = args.slice(1).join(" ");
					if (!groupTagName)
						return message.reply(getLang("noGroupTagName"));
					const groupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
					if (!groupTag)
						return message.reply(getLang("noExistedGroupTag", groupTagName));
					return showInfoGroupTag(message, groupTag, getLang);
				}
				const msg = groupTags.reduce((msg, group) => msg + `\n\n${group.name}:\n ${Object.values(group.users).map(name => name).join("\n ")}`, "");
				message.reply(msg || getLang("noExistedGroupTag2"));
				break;
			}
			case "info": {
				const groupTagName = args.slice(1).join(" ");
				if (!groupTagName)
					return message.reply(getLang("noGroupTagName"));
				const groupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
				if (!groupTag)
					return message.reply(getLang("noExistedGroupTag", groupTagName));
				return showInfoGroupTag(message, groupTag, getLang);
			}
			case "del": {
				const content = (args.slice(1) || []).join(" ");
				const mentionsID = Object.keys(event.mentions);
				const groupTagName = content.slice(0, content.indexOf(mentions[mentionsID[0]]) - 1).trim();
				if (!groupTagName)
					return message.reply(getLang("noGroupTagName"));
				if (mentionsID.length === 0)
					return message.reply(getLang("noMention", groupTagName));
				const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
				if (!oldGroupTag)
					return message.reply(getLang("noExistedGroupTag", groupTagName));
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

				let msg = "";
				if (usersIDNotExist.length > 0)
					msg += getLang("notExistedInGroupTag", usersIDNotExist.map(uid => mentions[uid]).join("\n"), groupTagName) + "\n";
				if (usersIDExist.length > 0)
					msg += getLang("deletedSuccess", usersIDExist.map(uid => mentions[uid]).join("\n"));
				message.reply(msg);
				break;
			}
			case "remove":
			case "rm": {
				const content = (args.slice(1) || []).join(" ");
				const groupTagName = content.trim();
				if (!groupTagName)
					return message.reply(getLang("noGroupTagName"));
				const index = groupTags.findIndex(group => group.name.toLowerCase() === groupTagName.toLowerCase());
				if (index === -1)
					return message.reply(getLang("noExistedGroupTag", groupTagName));
				groupTags.splice(index, 1);
				await threadsData.set(threadID, groupTags, "data.groupTags");
				message.reply(getLang("deletedSuccess2", groupTagName));
				break;
			}
			case "tag": {
				const content = (args.slice(1) || []).join(" ");
				const groupTagName = content.trim();
				if (!groupTagName)
					return message.reply(getLang("noGroupTagName"));
				const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
				if (!oldGroupTag)
					return message.reply(getLang("noExistedGroupTag", groupTagName));
				const { users } = oldGroupTag;
				const mentions = [];
				let msg = "";
				for (const uid in users) {
					const userName = users[uid];
					mentions.push({
						id: uid,
						tag: userName
					});
					msg += `${userName}\n`;
				}
				message.reply({
					body: getLang("tagged", groupTagName, msg),
					mentions
				});
				break;
			}
			case "rename": {
				const content = (args.slice(1) || []).join(" ");
				const [oldGroupTagName, newGroupTagName] = content.split("|").map(str => str.trim());
				if (!oldGroupTagName || !newGroupTagName)
					return message.reply(getLang("noGroupTagName2"));
				const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === oldGroupTagName.toLowerCase());
				if (!oldGroupTag)
					return message.reply(getLang("noExistedGroupTag", oldGroupTagName));
				oldGroupTag.name = newGroupTagName;
				await threadsData.set(threadID, groupTags, "data.groupTags");
				message.reply(getLang("renamedSuccess", oldGroupTagName, newGroupTagName));
				break;
			}
			default: {
				message.SyntaxError();
			}
		}
	}
};

function showInfoGroupTag(message, groupTag, getLang) {
	message.reply(getLang("infoGroupTag", groupTag.name, Object.keys(groupTag.users).length, Object.keys(groupTag.users).map(uid => groupTag.users[uid]).join("\n ")));
}