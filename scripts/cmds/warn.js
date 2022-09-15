const { getTime } = global.utils;

module.exports = {
	config: {
		name: "warn",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "cảnh cáo thành viên",
		longDescription: "cảnh cáo thành viên trong nhóm, đủ 3 lần ban khỏi box",
		category: "box chat",
		guide: "   {pn} {{@tag}} <lý do>: dùng cảnh cáo thành viên"
			+ "\n   {pn} {{list}}: xem danh sách những thành viên đã bị cảnh cáo"
			+ "\n   {pn} {{listban}}: xem danh sách những thành viên đã bị cảnh cáo đủ 3 lần và bị ban khỏi box"
			+ "\n   {pn} {{info [@tag | <uid>}} | để trống]: xem thông tin cảnh cáo của người được tag hoặc uid hoặc bản thân"
			+ "\n   {pn} {{unban <uid>}}: gỡ ban thành viên bằng uid"
			+ "\n   {pn} {{unwarn <uid> [<số thứ tự> | để trống]}}: gỡ cảnh cáo thành viên bằng uid và số thứ tự cảnh cáo"
			+ "\n   {pn} {{warn reset}}: reset tất cả dữ liệu cảnh cáo"
			+ "\n⚠️ Cần set quản trị viên cho bot để bot tự kick thành viên bị ban"
	},

	onStart: async function ({ message, api, event, args, threadsData, usersData, prefix, role }) {
		if (!args[0])
			return message.SyntaxError();
		const { threadID, senderID } = event;
		const warnList = await threadsData.get(threadID, "data.warn", []);

		switch (args[0]) {
			case "list": {
				const msg = await warnList.reduce(async (acc, user) => {
					const { uid, list } = user;
					const name = await usersData.getName(uid);
					return acc + `\n${name} (${uid}): ${list.length}`;
				}, "");
				message.reply(msg ? `Danh sách những thành viên bị cảnh cáo:\n${msg}\n\nĐể xem chi tiết những lần cảnh cáo hãy dùng lệnh {{"${`${prefix}warn check  [@tag | <uid> | để trống]"}}: để xem thông tin cảnh cáo của người được tag hoặc uid hoặc bản thân`}` : "Nhóm bạn chưa có thành viên nào bị cảnh cáo");
				break;
			}
			case "listban": {
				const msg = warnList
					.filter(user => user.list.length >= 3)
					.reduce(async (acc, user) => {
						const { uid } = user;
						const name = await usersData.getName(uid);
						return acc + `\n${name} (${uid})`;
					}, "");
				message.reply(msg ? `Danh sách những thành viên bị cảnh cáo đủ 3 lần và ban khỏi box:\n{{${msg}}}` : "Nhóm bạn chưa có thành viên nào bị ban khỏi box");
				break;
			}
			case "check":
			case "info": {
				let uids, msg = "";
				if (Object.keys(event.mentions).length)
					uids = Object.keys(event.mentions);
				else if (args.slice(1).length)
					uids = args.slice(1);
				else
					uids = [senderID];
				if (!uids)
					return message.reply("Vui lòng nhập uid hợp lệ của người bạn muốn xem thông tin");
				for (const uid of uids) {
					const dataWarnOfUser = warnList.find(user => user.uid == uid);
					msg += `\nUid: ${uid}`;
					if (!dataWarnOfUser || dataWarnOfUser.list.length == 0)
						msg += `\n  Không có dữ liệu nào`;
					else {
						const userName = await usersData.getName(uid);
						msg += `\nName: {{${userName}}}`
							+ `\nWarn list:` + dataWarnOfUser.list.reduce((acc, warn) => {
								const { dateTime, reason } = warn;
								return acc + `\n  Reason: {{${reason}}}\n  Time: {{${dateTime}}}`;
							}, "");
					}
					msg += "\n————————————";
				}
				message.reply(msg);
				break;
			}
			case "unban": {
				if (role < 1)
					return message.reply("❌ Chỉ quản trị viên nhóm mới có thể unban thành viên bị ban khỏi box");
				const uidUnban = args[1];
				if (!uidUnban || isNaN(uidUnban))
					return message.reply("⚠️ Vui lòng nhập uid hợp lệ của người muốn gỡ ban");
				const index = warnList.findIndex(user => user.uid == uidUnban && user.list.length >= 3);
				if (index === -1)
					return message.reply(`⚠️ Người dùng mang id ${uidUnban} chưa bị ban khỏi box của bạn`);
				warnList.splice(index, 1);
				await threadsData.set(threadID, warnList, "data.warn");
				const userName = await usersData.getName(uidUnban);
				message.reply(`✅ Đã gỡ ban thành viên {{[${uidUnban} | ${userName}]}}, hiện tại người này có thể tham gia box chat của bạn`);
				break;
			}
			case "unwarn": {
				if (role < 1)
					return message.reply("❌ Chỉ quản trị viên nhóm mới có thể gỡ cảnh cáo của thành viên trong nhóm");
				let uid, num;
				if (Object.keys(event.mentions)[0]) {
					uid = Object.keys(event.mentions)[0];
					num = args[args.length - 1];
				}
				else {
					uid = args[1];
					num = parseInt(args[2]) - 1;
				}
				if (isNaN(uid))
					return message.reply("⚠️ Vui lòng nhập uid hoặc tag người muốn gỡ cảnh cáo");
				const dataWarnOfUser = warnList.find(u => u.uid == uid);
				if (!dataWarnOfUser?.list.length)
					return message.reply(`⚠️ Người dùng mang id ${uid} chưa có dữ liệu cảnh cáo`);
				if (isNaN(num))
					num = dataWarnOfUser.list.length - 1;
				const userName = await usersData.getName(uid);
				if (num > dataWarnOfUser.list.length)
					return message.reply(`❌ Người dùng {{${userName}}} chỉ có ${dataWarnOfUser.list.length} lần cảnh cáo`);
				dataWarnOfUser.list.splice(parseInt(num), 1);
				await threadsData.set(threadID, warnList, "data.warn");
				message.reply(`✅ Đã gỡ lần cảnh cáo thứ ${num + 1} của thành viên {{[${uid} | ${userName}]}} thành công`);
				break;
			}
			case "reset": {
				if (role < 1)
					return message.reply("❌ Chỉ quản trị viên nhóm mới có thể reset dữ liệu cảnh cáo");
				await threadsData.set(threadID, [], "data.warn");
				message.reply("✅ Đã reset dữ liệu cảnh cáo thành công");
				break;
			}
			default: {
				if (role < 1)
					return message.reply("❌ Chỉ quản trị viên nhóm mới có thể cảnh cáo thành viên trong nhóm");
				let reason, uid;
				if (event.messageReply) {
					uid = event.messageReply.senderID;
					reason = args.join(" ").trim();
				}
				else if (Object.keys(event.mentions)[0]) {
					uid = Object.keys(event.mentions)[0];
					reason = args.join(" ").replace(event.mentions[uid], "").trim();
				}
				else {
					return message.reply("⚠️ Bạn cần phải tag hoặc phản hồi tin nhắn của người muốn cảnh cáo");
				}
				if (!reason)
					reason = "No reason";
				const dataWarnOfUser = warnList.find(item => item.uid == uid);
				const dateTime = getTime("DD/MM/YYYY hh:mm:ss");
				if (!dataWarnOfUser)
					warnList.push({
						uid,
						list: [{ reason, dateTime, warnBy: senderID }]
					});
				else
					dataWarnOfUser.list.push({ reason, dateTime, warnBy: senderID });

				await threadsData.set(threadID, warnList, "data.warn");

				const times = dataWarnOfUser?.list.length ?? 1;

				const userName = await usersData.getName(uid);
				if (times >= 3) {
					message.reply(`⚠️ Đã cảnh cáo thành viên {{${userName}}} lần ${times}`
						+ `\n- Uid: ${uid}`
						+ `\n- Lý do: {{${reason}}}`
						+ `\n- Date Time: {{${dateTime}}}`
						+ `\nThành viên này đã bị cảnh cáo đủ 3 lần và bị ban khỏi box, để gỡ ban hãy sử dụng lệnh {{"${prefix}warn unban <uid>"}} (với {{uid}} là {{uid}} của người muốn gỡ ban)`, () => {
							api.removeUserFromGroup(uid, threadID, (err) => {
								if (err)
									return message.reply(`Bot cần quyền quản trị viên để kick thành viên bị ban`, (e, info) => {
										const { onEvent } = global.GoatBot;
										onEvent.push({
											messageID: info.messageID,
											onStart: ({ event }) => {
												if (event.logMessageType === "log:thread-admins" && event.logMessageData.ADMIN_EVENT == "add_admin") {
													const { TARGET_ID } = event.logMessageData;
													if (TARGET_ID == api.getCurrentUserID()) {
														if ((warnList.find(user => user.uid == uid)?.list.length ?? 0) <= 3)
															global.GoatBot.onEvent = onEvent.filter(item => item.messageID != info.messageID);
														else
															api.removeUserFromGroup(uid, event.threadID, () => global.GoatBot.onEvent = onEvent.filter(item => item.messageID != info.messageID));
													}
												}
											}
										});
									});
							});
						});
				}
				else
					message.reply(`⚠️ Đã cảnh cáo thành viên {{${userName}}} lần ${times}`
						+ `\n- Uid: ${uid}`
						+ `\n- Lý do: {{${reason}}}`
						+ `\n- Date Time: {{${dateTime}}}`
						+ `\nNếu vi phạm ${3 - (times)} lần nữa người này sẽ bị ban khỏi box`
					);
			}
		}
	},

	onEvent: async ({ event, threadsData, usersData, message, api }) => {
		const { logMessageType, logMessageData } = event;
		if (logMessageType === "log:subscribe") {
			return async () => {
				const { data, adminIDs } = await threadsData.get(event.threadID);
				const warnList = data.warn?.warnList ?? [];
				if (!warnList.length)
					return;
				const { addedParticipants } = logMessageData;
				const hasBanned = [];

				for (const user of addedParticipants) {
					const { userFbId: uid } = user;
					const dataWarnOfUser = warnList.find(item => item.uid == uid);
					if (!dataWarnOfUser)
						continue;
					const { list } = dataWarnOfUser;
					if (list.length >= 3) {
						const userName = await usersData.getName(uid);
						hasBanned.push({
							uid,
							name: userName
						});
					}
				}

				if (hasBanned.length) {
					await message.send(`⚠️ Thành viên sau đã bị cảnh cáo đủ 3 lần trước đó và bị ban khỏi box:\n${hasBanned.map(item => `  - {{${item.name}}} (uid: ${item.uid})`).join("\n")}`);
					if (!adminIDs.includes(api.getCurrentUserID()))
						message.reply(`Bot cần quyền quản trị viên để kick thành viên bị ban`, (e, info) => {
							const { onEvent } = global.GoatBot;
							onEvent.push({
								messageID: info.messageID,
								onStart: ({ event }) => {
									if (event.logMessageType === "log:thread-admins" && event.logMessageData.ADMIN_EVENT == "add_admin") {
										const { TARGET_ID } = event.logMessageData;
										if (TARGET_ID == api.getCurrentUserID()) {
											removeUsers();
											global.GoatBot.onEvent = onEvent.filter(item => item.messageID != info.messageID);
										}
									}
								}
							});
						});
					else
						removeUsers(hasBanned, warnList, api, event, message);
				}
			};
		}
	}
};

async function removeUsers(hasBanned, warnList, api, event, message) {
	const failed = [];
	for (const user of hasBanned) {
		try {
			if (warnList.find(item => item.uid == user.uid)?.list.length ?? 0 >= 3)
				await api.removeUserFromGroup(user.uid, event.threadID);
		}
		catch (e) {
			failed.push({
				uid: user.uid,
				name: user.name
			});
		}
	}
	if (failed.length)
		message.reply(`⚠️ Đã xảy ra lỗi khi kick những thành viên sau:\n${failed.map(item => `  - {{${item}}} (uid: ${item.uid})`).join("\n")}`);
}