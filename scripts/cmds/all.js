module.exports = {
	config: {
		name: "all",
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 1,
		shortDescription: {
			vi: "Tag tất cả thành viên",
			en: "Tag all members"
		},
		longDescription: {
			vi: "Tag tất cả thành viên trong nhóm chat của bạn",
			en: "Tag all members in your group chat"
		},
		category: "box chat",
		guide: {
			vi: "{pn} [nội dung | để trống]",
			en: "{pn} [content | empty]"
		}
	},

	onStart: async function ({ message, event, args, api }) {
		const { participantIDs } = await api.getThreadInfo(event.threadID);
		const lengthAllUser = participantIDs.length;
		const mentions = [];
		let body = args.join(" ") || "@all";
		let bodyLength = body.length;
		let i = 0;
		for (const uid of participantIDs) {
			let fromIndex = 0;
			if (bodyLength < lengthAllUser) {
				body += body[bodyLength - 1];
				bodyLength++;
			}
			if (body.slice(0, i).lastIndexOf(body[i]) != -1)
				fromIndex = i;
			mentions.push({
				tag: body[i],
				id: uid, fromIndex
			});
			i++;
		}
		message.reply({ body, mentions });
	}
};