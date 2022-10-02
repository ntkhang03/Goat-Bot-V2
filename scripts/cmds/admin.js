const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "admin",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: "Thêm, xóa, sửa quyền admin",
		longDescription: "Thêm, xóa, sửa quyền admin",
		category: "box chat",
		guide: "   {pn} {{[add | -a] <uid>}}: Thêm quyền admin cho người dùng"
			+ "\n	  {pn} {{[remove | -r] <uid>}}: Xóa quyền admin của người dùng"
			+ "\n	  {pn} {{[list | -l]}}: Liệt kê danh sách admin"
	},

	onStart: async function ({ message, args, usersData, event }) {
		switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions)[0];
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.adminBot.push(...notAdminIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notAdminIds.length > 0 ? `✅ | Đã thêm quyền admin cho ${notAdminIds.length} người dùng:\n${getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")}` : '')
						+ (adminIds.length > 0 ? `\n⚠️ | ${adminIds.length} người dùng đã có quyền admin từ trước rồi:\n${adminIds.map(uid => `• ${uid}`).join("\n")}` : '')
					);
				}
				else
					return message.reply("Vui lòng nhập ID hoặc tag người dùng muốn thêm quyền admin");
			}
			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions)[0];
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					for (const uid of adminIds)
						config.adminBot.splice(config.adminBot.indexOf(uid), 1);
					const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(adminIds.length > 0 ? `✅ | Đã xóa quyền admin của ${adminIds.length} người dùng:\n${getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")}` : '')
						+ (notAdminIds.length > 0 ? `\n⚠️ | ${notAdminIds.length} người dùng không có quyền admin:\n${notAdminIds.map(uid => `• ${uid}`).join("\n")}` : '')
					);
				}
				else
					return message.reply("Vui lòng nhập ID hoặc tag người dùng muốn xóa quyền admin");
			}
			case "list":
			case "-l": {
				const getNames = await Promise.all(config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(`Danh sách admin bot hiện tại:\n${getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")}`);
			}
			default:
				return message.SyntaxError();
		}
	}
};