const { getStreamsFromAttachment, getTime } = global.utils;

module.exports = {
	config: {
		name: "sendnoti",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Tạo và gửi thông báo đến các nhóm",
		longDescription: "Tạo và gửi thông báo đến các nhóm do bạn quản lý",
		category: "box-chat",
		guide: "  + {pn} {{create}} <groupName>: Tạo một group noti (notification) mới với tên gọi <groupName>"
			+ "\n   Ví dụ: {pn} create TEAM1"
			+ "\n\n  + {pn} {{add <groupName>}}: thêm box chat hiện tại vào group noti <groupName> (bạn phải là quản trị viên của box chat này)"
			+ "\n   Ví dụ: {pn} {{add TEAM1}}"
			+ "\n\n  + {pn} {{delete}}: xóa box chat hiện tại khỏi group noti <groupName> (bạn phải là quản trị viên của box chat này)"
			+ "\n   Ví dụ: {pn} {{delete TEAM1}}"
			+ "\n\n  + {pn} {{send <groupName> | <message>}}: gửi thông báo tới tất cả các nhóm trong group noti <groupName> (bạn phải là quản trị viên của những box đó)"
			+ "\n   Ví dụ: {pn} {{remove TEAM1}}"
			+ "\n\n  + {pn} {{remove <groupName>}}: xóa group noti <groupName> (bạn phải là người tạo group noti <groupName>)"
			+ "\n   Ví dụ: {pn} {{remove TEAM1}}"
	},

	onStart: async function ({ message, event, args, usersData, threadsData, api }) {
		const { threadID, senderID } = event;
		const groupsSendNotiData = await usersData.get(senderID, 'data.groupsSendNoti', []);

		switch (args[0]) {
			case "create": {
				const groupName = args.slice(1).join(' ');
				const groupID = Date.now();
				if (!groupName)
					return message.reply('Vui lòng nhập tên groupNoti');

				const groupsSendNotiData = await usersData.get(senderID, 'data.groupsSendNoti', []);
				if (groupsSendNotiData.some(item => item.groupName === groupName))
					return message.reply(`Group send noti mang tên {{${groupName}}} đã được tạo trước đó bởi bạn rồi, vui lòng chọn tên khác`);

				groupsSendNotiData.push({
					groupName,
					groupID,
					threadIDs: []
				});
				await usersData.set(senderID, groupsSendNotiData, 'data.groupsSendNoti');
				message.reply(`Đã tạo group send noti thành công:\n- Name: {{${groupName}}}\n- ID: ${groupID}`);
				break;
			}
			case "add": {
				const groupName = args.slice(1).join(' ');
				if (!groupName)
					return message.reply('Vui lòng nhập tên groupNoti bạn muốn thêm nhóm chat này vào');
				const getGroup = (groupsSendNotiData || []).find(item => item.groupName == groupName);

				if (!getGroup)
					return message.reply(`Hiện tại bạn chưa tạo/quản lý group noti nào mang tên: {{${groupName}}}`);

				const adminIDs = await threadsData.get(threadID, 'adminIDs');
				if (!adminIDs.includes(senderID))
					return message.reply('Bạn không phải là quản trị viên của nhóm chat này');

				getGroup.threadIDs.push(threadID);
				await usersData.set(senderID, groupsSendNotiData, 'data.groupsSendNoti');

				message.reply(`Đã thêm nhóm chat hiện tại vào group noti: {{${groupName}}}`);
				break;
			}
			case "delete": {
				const groupName = args.slice(1).join(' ');
				if (!groupName)
					return message.reply('Vui lòng nhập tên groupNoti bạn muốn xóa nhóm chat này khỏi danh sách');

				const getGroup = (groupsSendNotiData || []).find(item => item.groupName == groupName);
				if (!getGroup)
					return message.reply(`Hiện tại bạn chưa tạo/quản lý group noti nào mang tên: {{${groupName}}}`);

				const adminIDs = await threadsData.get(threadID, 'adminIDs');
				if (!adminIDs.includes(senderID))
					return message.reply('Bạn không phải là quản trị viên của nhóm chat này');

				const findIndexThread = getGroup.threadIDs.findIndex(item => item == threadID);
				if (findIndexThread == -1)
					return message.reply(`Hiện tại nhóm chat này chưa có trong group noti {{${groupName}}}`);

				getGroup.threadIDs.splice(findIndexThread, 1);
				await usersData.set(senderID, groupsSendNotiData, 'data.groupsSendNoti');

				message.reply(`Đã xóa nhóm chat hiện tại khỏi group noti: {{${groupName}}}`);
				break;
			}
			case "remove":
			case "-r": {
				const groupName = args.slice(1).join(' ');
				if (!groupName)
					return message.reply('Vui lòng nhập tên groupNoti bạn muốn xóa bỏ');
				const findIndex = (groupsSendNotiData.threadIDs || []).findIndex(item => item.groupName == groupName);

				if (findIndex == -1)
					return message.reply(`Hiện tại bạn chưa tạo/quản lý group noti nào mang tên: {{${groupName}}}`);

				groupsSendNotiData.splice(findIndex, 1);
				await usersData.set(senderID, groupsSendNotiData, 'data.groupsSendNoti');

				message.reply(`Đã xóa bỏ group noti: {{${groupName}}}`);
				break;
			}
			case "send": {
				const groupName = args.slice(1).join(' ').split('|')[0].trim();
				if (!groupName)
					return message.reply('Vui lòng nhập tên groupNoti bạn muốn gủi tin nhắn');

				const getGroup = (groupsSendNotiData || []).find(item => item.groupName == groupName);
				if (!getGroup)
					return message.reply(`Hiện tại bạn chưa tạo/quản lý group noti nào mang tên: {{${groupName}}}}`);
				if (getGroup.threadIDs.length == 0)
					return message.reply(`Hiện tại group noti {{"${groupName}}} chưa có nhóm chat nào trong danh sách`);

				const messageSend = args.slice(2).join(' ').split('|').slice(1).join(' ').trim();
				const formSend = {
					body: messageSend
				};

				if (event.attachments.length || event.attachments.messageReply?.attachments.length)
					formSend.attachment = await getStreamsFromAttachment([...event.attachments, ...(event.messageReply?.attachments || [])]);

				const success = [];
				const failed = [];
				const pendings = [];

				const { threadIDs } = getGroup;
				const msgSend = message.reply(`Đang gửi thông báo đến {{${threadIDs.length}}} nhóm`);
				for (const tid of threadIDs) {
					await new Promise((r) => setTimeout(r, 1000));
					pendings.push(
						new Promise(async (resolve, reject) => {
							const { adminIDs, threadName } = await threadsData.get(tid);
							if (!adminIDs.includes(senderID))
								return reject({
									error: 'PERMISSION_DENIED',
									threadID: tid,
									threadName
								});
							api.sendMessage(formSend, tid, (err) => {
								if (err)
									reject({
										...err,
										threadID: tid,
										threadName
									});
								resolve({
									threadID: tid,
									threadName
								});
							});
						})
					);
				}

				for (const item of pendings) {
					try {
						await item;
						success.push({
							threadID: item.threadID,
							threadName: item.threadName
						});
					}
					catch (err) {
						failed.push({
							threadID: item.threadID,
							threadName: item.threadName,
							error: item.error
						});
					}
				}
				api.unsendMessage((await msgSend).messageID);
				message.reply(
					success.length ? `Đã gửi thông báo đến ${success.length} nhóm chat trong group noti "{{${groupName}}}" thành công` : ''
						+ (failed.length ? `Gửi thông báo đến {{${failed.length}}} nhóm thất bại: ${failed.map(item => `\n- id: ${item.threadID}\n- Name: ${item.threadName}\n- Error: ${item.error == 'PERMISSION_DENIED' ? 'Bạn không phải là quản trị viên của nhóm này' : ''}`).join('\n')}` : '')
				);

				break;
			}
			case "info": {
				const groupName = args.slice(1).join(' ');
				if (!groupName)
					return message.reply('Vui lòng nhập tên groupNoti bạn muốn xem thông tin');

				const getGroup = (groupsSendNotiData || []).find(item => item.groupName == groupName);
				if (!getGroup)
					return message.reply(`Hiện tại bạn chưa tạo/quản lý group noti nào mang tên: {{${groupName}}}}`);
				const { threadIDs } = getGroup;

				const allThreadData = await threadsData.getAll();

				const msg = threadIDs.reduce((acc, tid) => {
					const threadData = allThreadData.find(i => i.threadID == tid) || {};
					acc += ` + ID: ${tid}\n + Name: {{${threadData.threadName || 'null'}}}\n\n`;
					return acc;
				}, '');

				message.reply(`- Group Name: {{${groupName}}}\n- ID: {{${getGroup.groupID}}}\n- Ngày tạo: ${getTime(getGroup.groupID, 'DD/MM/YYYY HH:mm:ss')}\n- Gồm các nhóm chat:\n${msg ? `{{${msg}}}` : 'Không có nhóm chat nào'}`);
				break;
			}
			default: {
				return message.SyntaxError();
			}
		}
	}
};