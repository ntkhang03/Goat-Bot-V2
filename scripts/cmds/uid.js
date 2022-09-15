const { findUid } = global.utils;
const regExCheckURL = /^(http|https):\/\/[^ "]+$/;

module.exports = {
	config: {
		name: "uid",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Xem uid",
		longDescription: "Xem user id facebook của người dùng",
		category: "info",
		guide: "{pn}: dùng để xem id facebook của bạn"
			+ "\n{pn} {{@tag}}: xem id facebook của những người được tag"
			+ "\n{pn} {{link profile}}: xem id facebook của link profile"
	},

	onStart: async function ({ message, event, args }) {
		if (!args[0])
			return message.reply(event.senderID);
		if (args[0].match(regExCheckURL)) {
			let msg = '';
			for (const link of args) {
				try {
					const uid = await findUid(link);
					msg += `{{${link}}} => ${uid}\n`;
				}
				catch (e) {
					msg += `{{${link} (ERROR)}} => ${e.message}\n`;
				}
				message.reply(msg);
			}
			return;
		}
		let msg = "";
		const { mentions } = event;
		for (const id in mentions) msg += `{{${mentions[id].replace("@", "")}}}: ${id}\n`;
		message.reply(msg || "Vui lòng tag người muốn xem uid hoặc để trống để xem uid của bản thân");
	}
};