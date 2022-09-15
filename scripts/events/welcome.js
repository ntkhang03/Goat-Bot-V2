const fs = require("fs-extra");
const { getTime, drive } = global.utils;

module.exports = {
	config: {
		name: "welcome",
		version: "1.0",
		author: "NTKhang",
		envConfig: {
			defaultWelcomeMessage: `Xin chào {userName}.\nChào mừng {multiple} đã đến với nhóm chat: {boxName}\nChúc {multiple} có một buổi {session} vui vẻ 😊`
		}
	},

	onStart: async ({ threadsData, message, event, api, commandName, envEvents }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {
				const hours = getTime("HH");
				const { threadID } = event;
				const { nickNameBot } = global.GoatBot.config;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;
				// if new member is bot
				if (dataAddedParticipants.some(item => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
					return message.send(`Thank you for inviting me!\nPrefix bot: ${global.utils.getPrefix(threadID)}\nĐể xem danh sách lệnh hãy nhập: {{${prefix}help}}`);
				}
				// if new member:
				const threadData = await threadsData.get(threadID);
				if (threadData.settings.sendWelcomeMessage == false)
					return;
				const threadName = threadData.threadName;
				const userName = [], mentions = [];
				let multiple = false;

				if (dataAddedParticipants.length > 1)
					multiple = true;
				for (const user of dataAddedParticipants) {
					userName.push(user.fullName);
					mentions.push({
						tag: user.fullName,
						id: user.userFbId
					});
				}
				// {userName}:   tên của các thành viên mới
				// {multiple}:   bạn || các bạn
				// {boxName}:    tên của nhóm chat
				// {threadName}: tên của nhóm chat
				// {session}:    buổi trong ngày
				let { welcomeMessage = envEvents[commandName].defaultWelcomeMessage } = threadData.data;
				const form = {
					mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
				};
				welcomeMessage = welcomeMessage
					.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
					.replace(/\{boxName\}|\{threadName\}/g, threadName)
					.replace(/\{multiple\}/g, multiple ? "các bạn" : "bạn")
					.replace(/\{session\}/g, hours <= 10 ? "sáng" :
						hours > 10 && hours <= 12 ? "trưa" :
							hours > 12 && hours <= 18 ? "chiều" : "tối");

				form.body = `{{${welcomeMessage}}}`;

				if (threadData.data.welcomeAttachment) {
					const files = threadData.data.welcomeAttachment;

					// method save to local
					// const folder = `${__dirname}/data/welcomeAttachment/${threadID}`;
					// form.attachment = [];
					// for (const file of files)
					// form.attachment.push(fs.createReadStream(`${folder}/${file}`));

					// method save to drive
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