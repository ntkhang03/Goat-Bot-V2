module.exports = {
	config: {
		name: "checkwarn",
		version: "1.0",
		author: "NTKhang"
	},

	onStart: async ({ threadsData, message, event, api, client }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {
				const { threadID } = event;
				const { data } = await threadsData.get(event.threadID);
				const { warnList } = data;
				if (!warnList)
					return;
				const { addedParticipants } = event.logMessageData;
				for (const user of addedParticipants) {
					const findUser = warnList.find(user => user.userID == user.userID);
					if (findUser && findUser.list >= 3) {
						const userName = user.fullName;
						const uid = user.userFbId;
						message.send({
							body: `Thành viên ${userName} đã bị cảnh cáo đủ 3 lần trước đó và bị ban khỏi box chat`
								+ `\n- Name: ${userName}`
								+ `\n- Uid: ${uid}`
								+ `\n- Để gỡ ban vui lòng sử dụng lệnh "${client.getPrefix(threadID)}warn unban <uid>" (với uid là uid của người muốn gỡ ban)`,
							mentions: [{
								tag: userName,
								id: uid
							}]
						}, function () {
							api.removeUserFromGroup(uid, threadID, (err) => {
								if (err)
									return message.send(`Bot cần quyền quản trị viên để kick thành viên bị ban`);
							});
						});
					}
				}
			};
	}
};