const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "antichangeinfobox",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Chống đổi thông tin box chat",
		longDescription: "Bật tắt chức năng chống thành viên đổi thông tin box chat của bạn",
		category: "box chat",
		guide: "{pn} {{avt [on | off]}}: chống đổi avatar box chat"
			+ "\n{pn} {{name [on | off]}}: chống đổi tên box chat"
			+ "\n{pn} {{theme [on | off]}}: chống đổi theme (chủ đề) box chat"
			+ "\n{pn} {{emoji [on | off]}}: chống đổi trạng emoji box chat"
	},

	onStart: async function ({ message, event, args, threadsData }) {
		if (!["on", "off"].includes(args[1]))
			return message.SyntaxError();
		const { threadID } = event;
		const dataAntiChangeInfoBox = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
		async function checkAndSaveData(key, data, type) {
			dataAntiChangeInfoBox[key] = args[1] === "on" ? data : false;
			await threadsData.set(threadID, dataAntiChangeInfoBox, "data.antiChangeInfoBox");
			message.send(`Đã ${args[1] == "on" ? "bật" : "tắt"} chức năng chống đổi ${type} box chat`);
		}
		switch (args[0]) {
			case "avt":
			case "avatar": {
				const { imageSrc } = await threadsData.get(threadID);
				if (!imageSrc)
					return message.send("Box chat của bạn cần phải đặt avatar trước");
				await checkAndSaveData("avatar", imageSrc, "avatar");
				break;
			}
			case "name": {
				const { threadName } = await threadsData.get(threadID);
				await checkAndSaveData("name", threadName, "tên");
				break;
			}
			case "theme": {
				const { threadThemeID } = await threadsData.get(threadID);
				await checkAndSaveData("theme", threadThemeID, "chủ đề");
				break;
			}
			case "emoji": {
				const { emoji } = await threadsData.get(threadID);
				await checkAndSaveData("emoji", emoji, "emoji");
				break;
			}
			default: {
				return message.SyntaxError();
			}
		}
	},

	onEvent: async function ({ message, event, threadsData, role, api }) {
		const { threadID, logMessageType, logMessageData, author } = event;
		switch (logMessageType) {
			case "log:thread-image": {
				const imgURL = await threadsData.get(threadID, "data.antiChangeInfoBox.avatar");
				if (!imgURL)
					return;
				return async function () {
					if (role < 1 && api.getCurrentUserID() !== author) {
						message.reply(`Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi avatar`);
						api.changeGroupImage(await getStreamFromURL(imgURL), threadID);
					}
					else {
						const imageSrc = logMessageData.url;
						await threadsData.set(threadID, imageSrc, "data.antiChangeInfoBox.avatar");
					}
				};
			}
			case "log:thread-name": {
				const name = await threadsData.get(threadID, "data.antiChangeInfoBox.name");
				if (name == false)
					return;
				return async function () {
					if (role < 1 && api.getCurrentUserID() !== author) {
						message.reply(`Hiện tại box chat của bạn đang bật chức năng chống thành viên đổi tên nhóm`);
						api.setTitle(name, threadID);
					}
					else {
						const threadName = logMessageData.name;
						await threadsData.set(threadID, threadName, "data.antiChangeInfoBox.name");
					}
				};
			}
			case "log:thread-color": {
				const themeID = await threadsData.get(threadID, "data.antiChangeInfoBox.theme");
				if (themeID == false)
					return;
				return async function () {
					if (role < 1 && api.getCurrentUserID() !== author) {
						message.reply(`Hiện tại box chat của bạn đang bật chức năng chống thành viên đổi theme (chủ đề)`);
						api.changeThreadColor(themeID || "196241301102133", threadID); // 196241301102133 is default color
					}
					else {
						const threadThemeID = logMessageData.theme_id;
						await threadsData.set(threadID, threadThemeID, "data.antiChangeInfoBox.theme");
					}
				};
			}
			case "log:thread-icon": {
				const emoji = await threadsData.get(threadID, "data.antiChangeInfoBox.emoji");
				if (emoji == false)
					return;
				return async function () {
					if (role < 1 && api.getCurrentUserID() !== author) {
						message.reply(`Hiện tại box chat của bạn đang bật chức năng chống thành viên đổi emoji`);
						api.changeThreadEmoji(emoji, threadID);
					}
					else {
						const threadEmoji = logMessageData.thread_icon;
						await threadsData.set(threadID, threadEmoji, "data.antiChangeInfoBox.emoji");
					}
				};
			}
		}
	}
};