const { getTime } = global.utils;

module.exports = {
	config: {
		name: "thread",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Quản lý các nhóm chat",
		longDescription: "Quản lý các nhóm chat trong hệ thống bot",
		category: "owner",
		guide: "{pn} {{[find | -f | search | -s]}} <tên cần tìm>: tìm kiếm nhóm chat trong dữ liệu bot bằng tên"
			+ "\n{pn} [{{ban | -b] [<tid>}} | để trống] {{<reason>}}: dùng để cấm nhóm mang id {{<tid>}} hoặc nhóm hiện tại sử dụng bot"
			+ "\nVí dụ:"
			+ "\n   {pn} {{ban 3950898668362484 spam bot}}"
			+ "\n   {pn} {{ban spam quá nhiều}}"
			+ "\n   {pn} {{unban [<tid>}} | để trống] để bỏ cấm nhóm mang id {{<tid>}} hoặc nhóm hiện tại"
	},

	onStart: async function ({ args, threadsData, message, role, event }) {
		const type = args[0];

		switch (type) {
			// find thread
			case "find":
			case "search":
			case "-f":
			case "-s": {
				if (role < 2)
					return message.reply("Bạn không có quyền sử dụng tính năng này");
				const allThread = await threadsData.getAll();
				const keyword = args.slice(1).join(" ");
				const result = allThread.filter(item => item.threadName.toLowerCase().includes(keyword.toLowerCase()));
				const msg = result.reduce((i, thread) => i += `\n╭Name: {{${thread.threadName}}}\n╰ID: ${thread.threadID}`, "");
				message.reply(result.length == 0 ? `❌ Không tìm thấy nhóm nào có tên khớp với từ khoá: "{{${keyword}}}" trong dữ liệu của bot` : `🔎 Tìm thấy ${result.length} nhóm trùng với từ khóa "{{${keyword}}}" trong dữ liệu của bot:\n${msg}`);
				break;
			}
			// ban thread
			case "ban":
			case "-b": {
				if (role < 2)
					return message.reply("Bạn không có quyền sử dụng tính năng này");
				let tid, reason;
				if (!isNaN(args[1])) {
					tid = args[1];
					reason = args.slice(2).join(" ");
				}
				else {
					tid = event.threadID;
					reason = args.slice(1).join(" ");
				}
				if (!tid || !reason)
					return message.SyntaxError();
				reason = reason.replace(/\s+/g, ' ');
				const threadData = await threadsData.get(tid);
				const name = threadData.threadName;
				const status = threadData.banned.status;

				if (status)
					return message.reply(`Nhóm mang id [${tid} | {{${name}}}] đã bị cấm từ trước:\n» Lý do: {{${threadData.banned.reason}}}\n» Thời gian: ${threadData.banned.date}`);
				const time = getTime("DD/MM/YYYY HH:mm:ss");
				await threadsData.set(tid, {
					banned: {
						status: true,
						reason,
						date: time
					}
				});
				return message.reply(`Đã cấm nhóm mang id [${tid} | {{${name}}}] sử dụng bot.\n» Lý do: ${reason}\n» Thời gian: ${time}`);
			}
			// unban thread
			case "unban":
			case "-u": {
				if (role < 2)
					return message.reply("Bạn không có quyền sử dụng tính năng này");
				let tid;
				if (!isNaN(args[1]))
					tid = args[1];
				else
					tid = event.threadID;
				if (!tid)
					return message.SyntaxError();

				const threadData = await threadsData.get(tid);
				const name = threadData.threadName;
				const status = threadData.banned.status;

				if (!status)
					return message.reply(`Hiện tại nhóm mang id [${tid} | {{${name}}}] không bị cấm sử dụng bot`);
				await threadsData.set(tid, {
					banned: {
						status: false,
						reason: null
					}
				});
				return message.reply(`Đã bỏ cấm nhóm mang tid [${tid} | {{${name}}}] sử dụng bot`);
			}
			// info thread
			case "info":
			case "-i": {
				let tid;
				if (!isNaN(args[1]))
					tid = args[1];
				else
					tid = event.threadID;
				if (!tid)
					return message.SyntaxError();
				const threadData = await threadsData.get(tid);
				const valuesMember = Object.values(threadData.members).filter(item => item.inGroup);
				const msg = `» Box ID: ${threadData.threadID}`
					+ `\n» Tên: {{${threadData.threadName}}}`
					+ `\n» Ngày tạo data: ${getTime(threadData.createdAt, "DD/MM/YYYY HH:mm:ss")}`
					+ `\n» Tổng thành viên: ${valuesMember.length}`
					+ `\n» Nam: ${valuesMember.filter(item => item.gender == "MALE").length} thành viên`
					+ `\n» Nữ: ${valuesMember.filter(item => item.gender == "FEMALE").length} thành viên`
					+ `\n» Tổng tin nhắn: ${valuesMember.reduce((i, item) => i += item.count, 0)}`
					+ (threadData.banned.status ? `\n- Banned: ${threadData.banned.status}`
						+ `\n- Reason: {{${threadData.banned.reason}}}`
						+ `\n- Time: ${threadData.banned.date}` : "");
				return message.reply(msg);
			}
			default:
				return message.SyntaxError();
		}
	}
};