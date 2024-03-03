const { getStreamFromURL, uploadImgbb } = global.utils;

module.exports = {
	config: {
		name: "antichangeinfobox",
		version: "1.9",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Bật tắt chức năng chống thành viên đổi thông tin box chat của bạn",
			en: "Turn on/off anti change info box"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} avt [on | off]: chống đổi avatar box chat"
				+ "\n   {pn} name [on | off]: chống đổi tên box chat"
				+ "\n   {pn} nickname [on | off]: chống đổi nickname trong box chat"
				+ "\n   {pn} theme [on | off]: chống đổi theme (chủ đề) box chat"
				+ "\n   {pn} emoji [on | off]: chống đổi trạng emoji box chat",
			en: "   {pn} avt [on | off]: anti change avatar box chat"
				+ "\n   {pn} name [on | off]: anti change name box chat"
				+ "\n   {pn} nickname [on | off]: anti change nickname in box chat"
				+ "\n   {pn} theme [on | off]: anti change theme (chủ đề) box chat"
				+ "\n   {pn} emoji [on | off]: anti change emoji box chat"
		}
	},

	langs: {
		vi: {
			antiChangeAvatarOn: "Đã bật chức năng chống đổi avatar box chat",
			antiChangeAvatarOff: "Đã tắt chức năng chống đổi avatar box chat",
			missingAvt: "Bạn chưa đặt avatar cho box chat",
			antiChangeNameOn: "Đã bật chức năng chống đổi tên box chat",
			antiChangeNameOff: "Đã tắt chức năng chống đổi tên box chat",
			antiChangeNicknameOn: "Đã bật chức năng chống đổi nickname box chat",
			antiChangeNicknameOff: "Đã tắt chức năng chống đổi nickname box chat",
			antiChangeThemeOn: "Đã bật chức năng chống đổi theme (chủ đề) box chat",
			antiChangeThemeOff: "Đã tắt chức năng chống đổi theme (chủ đề) box chat",
			antiChangeEmojiOn: "Đã bật chức năng chống đổi emoji box chat",
			antiChangeEmojiOff: "Đã tắt chức năng chống đổi emoji box chat",
			antiChangeAvatarAlreadyOn: "Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi avatar",
			antiChangeAvatarAlreadyOnButMissingAvt: "Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi avatar box chat chưa được đặt avatar",
			antiChangeNameAlreadyOn: "Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi tên",
			antiChangeNicknameAlreadyOn: "Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi nickname",
			antiChangeThemeAlreadyOn: "Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi theme (chủ đề)",
			antiChangeEmojiAlreadyOn: "Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi emoji"
		},
		en: {
			antiChangeAvatarOn: "Turn on anti change avatar box chat",
			antiChangeAvatarOff: "Turn off anti change avatar box chat",
			missingAvt: "You have not set avatar for box chat",
			antiChangeNameOn: "Turn on anti change name box chat",
			antiChangeNameOff: "Turn off anti change name box chat",
			antiChangeNicknameOn: "Turn on anti change nickname box chat",
			antiChangeNicknameOff: "Turn off anti change nickname box chat",
			antiChangeThemeOn: "Turn on anti change theme box chat",
			antiChangeThemeOff: "Turn off anti change theme box chat",
			antiChangeEmojiOn: "Turn on anti change emoji box chat",
			antiChangeEmojiOff: "Turn off anti change emoji box chat",
			antiChangeAvatarAlreadyOn: "Your box chat is currently on anti change avatar",
			antiChangeAvatarAlreadyOnButMissingAvt: "Your box chat is currently on anti change avatar but your box chat has not set avatar",
			antiChangeNameAlreadyOn: "Your box chat is currently on anti change name",
			antiChangeNicknameAlreadyOn: "Your box chat is currently on anti change nickname",
			antiChangeThemeAlreadyOn: "Your box chat is currently on anti change theme",
			antiChangeEmojiAlreadyOn: "Your box chat is currently on anti change emoji"
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang }) {
		if (!["on", "off"].includes(args[1]))
			return message.SyntaxError();
		const { threadID } = event;
		const dataAntiChangeInfoBox = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
		async function checkAndSaveData(key, data) {
			// dataAntiChangeInfoBox[key] = args[1] === "on" ? data : false;
			if (args[1] === "off")
				delete dataAntiChangeInfoBox[key];
			else
				dataAntiChangeInfoBox[key] = data;

			await threadsData.set(threadID, dataAntiChangeInfoBox, "data.antiChangeInfoBox");
			message.reply(getLang(`antiChange${key.slice(0, 1).toUpperCase()}${key.slice(1)}${args[1].slice(0, 1).toUpperCase()}${args[1].slice(1)}`));
		}
		switch (args[0]) {
			case "avt":
			case "avatar":
			case "image": {
				const { imageSrc } = await threadsData.get(threadID);
				if (!imageSrc)
					return message.reply(getLang("missingAvt"));
				const newImageSrc = await uploadImgbb(imageSrc);
				await checkAndSaveData("avatar", newImageSrc.image.url);
				break;
			}
			case "name": {
				const { threadName } = await threadsData.get(threadID);
				await checkAndSaveData("name", threadName);
				break;
			}
			case "nickname": {
				const { members } = await threadsData.get(threadID);
				await checkAndSaveData("nickname", members.map(user => ({ [user.userID]: user.nickname })).reduce((a, b) => ({ ...a, ...b }), {}));
				break;
			}
			case "theme": {
				const { threadThemeID } = await threadsData.get(threadID);
				await checkAndSaveData("theme", threadThemeID);
				break;
			}
			case "emoji": {
				const { emoji } = await threadsData.get(threadID);
				await checkAndSaveData("emoji", emoji);
				break;
			}
			default: {
				return message.SyntaxError();
			}
		}
	},

	onEvent: async function ({ message, event, threadsData, role, api, getLang }) {
		const { threadID, logMessageType, logMessageData, author } = event;
		switch (logMessageType) {
			case "log:thread-image": {
				const dataAntiChange = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
				if (!dataAntiChange.avatar && role < 1)
					return;
				return async function () {
					// check if user not is admin or bot then change avatar back
					if (role < 1 && api.getCurrentUserID() !== author) {
						if (dataAntiChange.avatar != "REMOVE") {
							message.reply(getLang("antiChangeAvatarAlreadyOn"));
							api.changeGroupImage(await getStreamFromURL(dataAntiChange.avatar), threadID);
						}
						else {
							message.reply(getLang("antiChangeAvatarAlreadyOnButMissingAvt"));
						}
					}
					// else save new avatar
					else {
						const imageSrc = logMessageData.url;
						if (!imageSrc)
							return await threadsData.set(threadID, "REMOVE", "data.antiChangeInfoBox.avatar");

						const newImageSrc = await uploadImgbb(imageSrc);
						await threadsData.set(threadID, newImageSrc.image.url, "data.antiChangeInfoBox.avatar");
					}
				};
			}
			case "log:thread-name": {
				const dataAntiChange = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
				// const name = await threadsData.get(threadID, "data.antiChangeInfoBox.name");
				// if (name == false)
				if (!dataAntiChange.hasOwnProperty("name"))
					return;
				return async function () {
					if (role < 1 && api.getCurrentUserID() !== author) {
						message.reply(getLang("antiChangeNameAlreadyOn"));
						api.setTitle(dataAntiChange.name, threadID);
					}
					else {
						const threadName = logMessageData.name;
						await threadsData.set(threadID, threadName, "data.antiChangeInfoBox.name");
					}
				};
			}
			case "log:user-nickname": {
				const dataAntiChange = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
				// const nickname = await threadsData.get(threadID, "data.antiChangeInfoBox.nickname");
				// if (nickname == false)
				if (!dataAntiChange.hasOwnProperty("nickname"))
					return;
				return async function () {
					const { nickname, participant_id } = logMessageData;

					if (role < 1 && api.getCurrentUserID() !== author) {
						message.reply(getLang("antiChangeNicknameAlreadyOn"));
						api.changeNickname(dataAntiChange.nickname[participant_id], threadID, participant_id);
					}
					else {
						await threadsData.set(threadID, nickname, `data.antiChangeInfoBox.nickname.${participant_id}`);
					}
				};
			}
			case "log:thread-color": {
				const dataAntiChange = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
				// const themeID = await threadsData.get(threadID, "data.antiChangeInfoBox.theme");
				// if (themeID == false)
				if (!dataAntiChange.hasOwnProperty("theme"))
					return;
				return async function () {
					if (role < 1 && api.getCurrentUserID() !== author) {
						message.reply(getLang("antiChangeThemeAlreadyOn"));
						api.changeThreadColor(dataAntiChange.theme || "196241301102133", threadID); // 196241301102133 is default color
					}
					else {
						const threadThemeID = logMessageData.theme_id;
						await threadsData.set(threadID, threadThemeID, "data.antiChangeInfoBox.theme");
					}
				};
			}
			case "log:thread-icon": {
				const dataAntiChange = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
				// const emoji = await threadsData.get(threadID, "data.antiChangeInfoBox.emoji");
				// if (emoji == false)
				if (!dataAntiChange.hasOwnProperty("emoji"))
					return;
				return async function () {
					if (role < 1 && api.getCurrentUserID() !== author) {
						message.reply(getLang("antiChangeEmojiAlreadyOn"));
						api.changeThreadEmoji(dataAntiChange.emoji, threadID);
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