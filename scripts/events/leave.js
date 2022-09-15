const { getTime, drive } = global.utils;

module.exports = {
	config: {
		name: "leave",
		version: "1.0",
		author: "NTKhang",
		envConfig: {
			defaultLeaveMessage: "{userName} đã {type} khỏi nhóm"
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, commandName, envEvents }) => {
		if (event.logMessageType == "log:unsubscribe")
			return async function () {
				const { threadID } = event;
				const threadData = await threadsData.get(threadID);
				if (!threadData.settings.sendLeaveMessage)
					return;
				const { leftParticipantFbId } = event.logMessageData;
				if (leftParticipantFbId == api.getCurrentUserID())
					return;
				const hours = getTime("HH");

				const threadName = threadData.threadName;
				const userName = await usersData.getName(leftParticipantFbId);

				// {userName}   : tên của thành viên bị kick / tự out
				// {type}       : tự rời/bị qtv kick
				// {boxName}    : tên của nhóm chat
				// {threadName} : tên của nhóm chat
				// {time}       : thời gian rời
				// {session}    : buổi trong ngày
				let { leaveMessage = envEvents[commandName].defaultLeaveMessage } = threadData.data;
				const form = {
					mentions: leaveMessage.match(/\{userNameTag\}/g) ? [{
						tag: userName,
						id: leftParticipantFbId
					}] : null
				};

				leaveMessage = leaveMessage
					.replace(/\{userName\}|\{userNameTag\}/g, userName)
					.replace(/\{type\}/g, leftParticipantFbId == event.author ? "tự rời" : "bị quản trị viên xóa")
					.replace(/\{threadName\}|\{boxName\}/g, threadName)
					.replace(/\{time\}/g, hours)
					.replace(/\{session\}/g, hours <= 10 ? "sáng" :
						hours > 10 && hours <= 12 ? "trưa" :
							hours > 12 && hours <= 18 ? "chiều" : "tối"
					);

				form.body = `{{${leaveMessage}}}`;

				if (leaveMessage.includes("{userNameTag}")) {
					form.mentions = [{
						id: leftParticipantFbId,
						tag: userName
					}];
				}

				if (threadData.data.leaveAttachment) {
					const files = threadData.data.leaveAttachment;
					const attachments = files.reduce((acc, file) => {
						acc.push(drive.getFile(file, "stream"));
						return acc;
					}, []);
					form.attachment = (await Promise.allSettled(attachments))
						.filter(({ status }) => status == "fulfilled")
						.map(({ value }) => value);
				}
				message.send(form);
			};
	}
};