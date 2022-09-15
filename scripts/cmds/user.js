const { getTime } = global.utils;

module.exports = {
	config: {
		name: "user",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: "Quản lý người dùng",
		longDescription: "Quản lý người dùng trong hệ thống bot",
		category: "owner",
		guide: "{pn} {{[find | -f | search | -s]}} <tên cần tìm>: tìm kiếm người dùng trong dữ liệu bot bằng tên"
			+ "\n"
			+ "\n{pn} {{[ban | -b] [<uid> | @tag}} | reply tin nhắn] {{<reason>}}: để cấm người dùng mang id <uid> hoặc người được tag hoặc người gửi của tin nhắn được reply sử dụng bot"
			+ "\n"
			+ "\n{pn} {{unban [<uid> | @tag}} | reply tin nhắn]: để bỏ cấm người dùng sử dụng bot"
	},

	onStart: async function ({ args, usersData, message, event, prefix }) {
		const type = args[0];
		switch (type) {
			// find user
			case "find":
			case "-f":
			case "search":
			case "-s": {
				const allUser = await usersData.getAll();
				const keyWord = args.slice(1).join(" ");
				const result = allUser.filter(item => item.name.toLowerCase().includes(keyWord.toLowerCase()));
				const msg = result.reduce((i, user) => i += `\n╭Name: {{${user.name}}}\n╰ID: ${user.userID}`, "");
				message.reply(result.length == 0 ? `❌ Không tìm thấy người dùng nào có tên khớp với từ khóa: "{{${keyWord}}}" trong dữ liệu của bot` : `🔎 Tìm thấy ${result.length} người dùng có tên trùng với từ khóa "{{${keyWord}}}" trong dữ liệu của bot:\n${msg}`);
				break;
			}
			// ban user
			case "ban":
			case "-b": {
				let uid, reason;
				if (event.type == "message_reply") {
					uid = event.messageReply.senderID;
					reason = args.slice(1).join(" ");
				}
				else if (Object.keys(event.mentions).length > 0) {
					const { mentions } = event;
					uid = Object.keys(mentions)[0];
					reason = args.slice(1).join(" ").replace(mentions[uid], "");
				}
				else if (args[1]) {
					uid = args[1];
					reason = args.slice(2).join(" ");
				}
				else return message.SyntaxError();

				if (!uid)
					return message.reply("Uid của người cần ban không được để trống, vui lòng nhập uid hoặc tag hoặc reply tin nhắn của 1 người theo cú pháp user ban <uid> <lý do>");
				if (!reason)
					return message.reply(`Lý do cấm người dùng không được để trống, vui lòng soạn tin nhắn theo cú pháp {{${prefix}user ban <uid>}} <lý do>`);
				reason = reason.replace(/\s+/g, ' ');

				const userData = await usersData.get(uid);
				const name = userData.name;
				const status = userData.banned.status;

				if (status)
					return message.reply(`Người dùng mang id [${uid} | {{${name}}}] đã bị cấm từ trước:\n» Lý do: {{${userData.banned.reason}}}\n» Thời gian: ${userData.banned.date}`);
				const time = getTime("DD/MM/YYYY HH:mm:ss");
				await usersData.set(uid, {
					banned: {
						status: true,
						reason,
						date: time
					}
				});
				message.reply(`Đã cấm người dùng mang id [${uid} | {{${name}}}] sử dụng bot.\n» Lý do: ${reason}\n» Thời gian: ${time}`);
				break;
			}
			// unban user
			case "unban":
			case "-u": {
				let uid;
				if (event.type == "message_reply") {
					uid = event.messageReply.senderID;
				}
				else if (Object.keys(event.mentions).length > 0) {
					const { mentions } = event;
					uid = Object.keys(mentions)[0];
				}
				else if (args[1]) {
					uid = args[1];
				}
				else return message.SyntaxError();
				if (!uid)
					return message.reply(`Uid của người cần unban không được để trống`);
				const userData = await usersData.get(uid);
				const name = userData.name;
				const status = userData.banned.status;
				if (!status)
					return message.reply(`Hiện tại người dùng mang id [${uid} | {{${name}}}] không bị cấm sử dụng bot`);
				await usersData.set(uid, {
					banned: {
						status: false,
						reason: null
					}
				});
				message.reply(`Đã bỏ cấm người dùng mang id [${uid} | {{${name}}}], hiện tại người này có thể sử dụng bot`);
				break;
			}
			default:
				return message.SyntaxError();
		}
	}
};