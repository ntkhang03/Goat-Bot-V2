const { findUid } = global.utils;

module.exports = {
	config: {
		name: "adduser",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 1,
		shortDescription: "Thêm thành viên vào box chat",
		longDescription: "Thêm thành viên vào box chat của bạn",
		category: "box chat",
		guide: "{pn} {{[link profile | uid]}}"
	},

	onStart: async function ({ message, api, event, args, threadsData }) {
		const { members, adminIDs, approvalMode } = await threadsData.get(event.threadID);
		const success = [{
			type: "success",
			uids: []
		}, {
			type: "waitApproval",
			uids: []
		}];
		const failed = [];

		function checkErrorAndPush(messageError, item) {
			const findType = failed.find(error => error.type == messageError);
			if (findType)
				findType.uids.push(item);
			else
				failed.push({
					type: messageError,
					uids: [item]
				});
		}

		for (const item of args) {
			let uid;
			if (isNaN(item)) {
				try {
					uid = await findUid(item);
				}
				catch (err) {
					checkErrorAndPush(err.message, item);
					continue;
				}
			}
			else
				uid = item;

			if (members.some(m => m.userID == uid)?.inGroup) {
				checkErrorAndPush("Đã có trong nhóm", item);
			}
			else {
				try {
					await api.addUserToGroup(uid, event.threadID);
					const botID = api.getCurrentUserID();
					if (approvalMode === true && !adminIDs.includes(botID))
						success[1].uids.push(uid);
					else
						success[0].uids.push(uid);
				}
				catch (err) {
					checkErrorAndPush(err.errorDescription, item);
				}
			}
		}

		const lengthUserSuccess = success[0].uids.length;
		const lengthUserWaitApproval = success[1].uids.length;
		const lengthUserError = failed.length;

		let msg = "";
		if (lengthUserSuccess)
			msg += `- Đã thêm thành công ${lengthUserSuccess} thành viên vào nhóm`;
		if (lengthUserWaitApproval)
			msg += `\n- Đã thêm ${lengthUserWaitApproval} thành viên vào danh sách phê duyệt`;
		if (lengthUserError)
			msg += `\n- Đã xảy ra lỗi khi thêm ${lengthUserError} thành viên vào nhóm:${failed.reduce((a, b) => a += `\n    + {{${b.uids.join('; ')}: ${b.type}}}`, "")}`;
		await message.reply(msg);
	}
};