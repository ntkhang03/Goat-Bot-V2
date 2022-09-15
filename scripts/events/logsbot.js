const { getTime, checkAndTranslate } = global.utils;

module.exports = {
	config: {
		name: "logsbot",
		isBot: true,
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		envConfig: {
			allow: true
		}
	},

	onStart: async ({ usersData, threadsData, event, api }) => {
		if (
			(event.logMessageType == "log:subscribe" && event.logMessageData.addedParticipants.some(item => item.userFbId == api.getCurrentUserID()))
			|| (event.logMessageType == "log:unsubscribe" && event.logMessageData.leftParticipantFbId == api.getCurrentUserID())
		) return async function () {
			let msg = "====== Nhật ký bot ======";
			const { author, threadID } = event;
			if (author == api.getCurrentUserID())
				return;
			let threadName;
			const { config } = global.GoatBot;

			if (event.logMessageType == "log:subscribe") {
				if (!event.logMessageData.addedParticipants.some(item => item.userFbId == api.getCurrentUserID()))
					return;
				if (config.nickNameBot)
					api.changeNickname(config.nickNameBot, event.threadID, api.getCurrentUserID());
				threadName = (await api.getThreadInfo(threadID)).threadName;
				const authorName = await usersData.getName(author);
				msg += `\n✅\nSự kiện: bot được thêm vào nhóm mới`
					+ `\n- Người thêm: {{${authorName}}}`;
			}
			else if (event.logMessageType == "log:unsubscribe") {
				if (event.logMessageData.leftParticipantFbId != api.getCurrentUserID())
					return;
				const authorName = await usersData.getName(author);
				const threadData = await threadsData.get(threadID);
				threadName = threadData.threadName;
				msg += `\n❌\nSự kiện: bot bị kick`
					+ `\n- Người kick: {{${authorName}}}`;
			}
			const time = getTime("DD/MM/YYYY HH:mm:ss");
			msg += `\n- User ID: ${author}` +
				`\n- Nhóm: {{${threadName}}}` +
				`\n- ID nhóm: ${threadID}` +
				`\n- Thời gian: ${time}`;

			for (const adminID of config.adminBot)
				api.sendMessage(await checkAndTranslate(msg), adminID);
		};
	}
};