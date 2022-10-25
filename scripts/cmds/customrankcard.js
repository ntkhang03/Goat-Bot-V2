const axios = require("axios");
const rgbRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
const checkUrlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const hexColorRegex = /^#([0-9a-f]{6})$/i;

module.exports = {
	config: {
		name: "customrankcard",
		version: "1.3",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Thiết kế thẻ rank",
			en: "Design rank card"
		},
		longDescription: {
			vi: "Thiết kế thẻ rank theo ý bạn",
			en: "Design rank card by your own"
		},
		category: "rank",
		guide: {
			vi: {
				body: "   {pn} [maincolor | subcolor | expcolor | expnextlevelcolor | alphasubcolor | textcolor | reset] <value>"
					+ "\n   Trong đó: "
					+ "\n  + maincolor | background: background chính của thẻ rank (hex color or rgba or url image)"
					+ "\n  + subcolor: background phụ (hex color or rgba or url image)"
					+ "\n  + expcolor: màu của thanh exp hiện tại"
					+ "\n  + expnextlevelcolor: màu của thanh exp full"
					+ "\n  + alphasubcolor: độ mờ của background phụ (từ 0 -> 1)"
					+ "\n  + textcolor: màu của chữ (hex color or rgba)"
					+ "\n Reset: reset về mặc định"
					+ "\n   Ví dụ:"
					+ "\n    {pn} maincolor #fff000"
					+ "\n    {pn} subcolor rgba(255,136,86,0.4)"
					+ "\n    {pn} reset",
				attachment: [__dirname + "/assets/guide/customrankcard/guide1.jpg"]
			},
			en: {
				body: "   {pn} [maincolor | subcolor | expcolor | expnextlevelcolor | alphasubcolor | textcolor | reset] <value>"
					+ "\n   In which: "
					+ "\n  + maincolor | background: main background of rank card (hex color or rgba or url image)"
					+ "\n  + subcolor: sub background (hex color or rgba or url image)"
					+ "\n  + expcolor: color of current exp bar"
					+ "\n  + expnextlevelcolor: color of full exp bar"
					+ "\n  + alphasubcolor: alpha of sub background (from 0 -> 1)"
					+ "\n  + textcolor: color of text (hex color or rgba)"
					+ "\n  + reset: reset to default"
					+ "\n   Example:"
					+ "\n    {pn} maincolor #fff000"
					+ "\n    {pn} subcolor rgba(255,136,86,0.4)"
					+ "\n    {pn} reset",
				attachment: {
					[__dirname + "/assets/guide/customrankcard/guide1.jpg"]: "https://github.com/ntkhang03/Goat-Bot-V2/raw/main/scripts/cmds/assets/guide/customrankcard/guide1.jpg"
				}
			}
		}
	},

	langs: {
		vi: {
			invalidImage: "Url hình ảnh không hợp lệ, vui lòng chọn 1 url với trang đích là hình ảnh",
			invalidAttachment: "File đính kèm không phải là hình ảnh",
			invalidColor: "Mã màu không hợp lệ, vui lòng nhập mã hex color (6 chữ số) hoặc mã màu rgba",
			success: "Đã lưu thay đổi của bạn",
			invalidAlpha: "Vui lòng chọn chỉ số trong khoảng từ 0 -> 1"
		},
		en: {
			invalidImage: "Invalid image url, please choose a url with image as destination",
			invalidAttachment: "Invalid attachment, please choose an image file",
			invalidColor: "Invalid color code, please choose a hex color code (6 digits) or rgba color code",
			success: "Your changes have been saved",
			invalidAlpha: "Please choose a number from 0 -> 1"
		}
	},

	onStart: async function ({ message, threadsData, event, args, getLang }) {
		if (!args[0])
			return message.SyntaxError();

		const { data } = await threadsData.get(event.threadID);
		if (!data.customRankCard)
			data.customRankCard = {};

		const oldDesign = data.customRankCard;
		const key = args[0].toLowerCase();
		let value = args.slice(1).join(" ");

		if (["subcolor", "maincolor", "background", "expcolor", "textcolor", "expnextlevelcolor"].includes(key)) {
			if (value.match(checkUrlRegex)) {
				// if image url
				const contentType = (await axios.get(value)).headers["content-type"];
				if (!contentType.includes("image"))
					return message.reply(getLang("invalidImage"));
			}
			else if (event.messageReply && event.messageReply.attachments?.length > 0) {
				// if image attachment
				if (!["photo", "animated_image"].includes(event.messageReply.attachments[0].type))
					return message.reply(getLang("invalidAttachment"));
				value = event.messageReply.attachments[0].url;
			}
			else {
				// if color
				if (!value.match(rgbRegex) && !value.match(hexColorRegex))
					return message.reply(getLang("invalidColor"));
			}

			switch (key) {
				case "subcolor":
					oldDesign.sub_color = value;
					break;
				case "maincolor":
				case "background":
					oldDesign.main_color = value;
					break;
				case "expcolor":
					oldDesign.exp_color = value;
					break;
				case "textcolor":
					oldDesign.text_color = value;
					break;
				case "expnextlevelcolor":
					oldDesign.expNextLevel_color = value;
					break;
			}
			try {
				await threadsData.set(event.threadID, {
					data
				});
				message.reply(getLang("success"));
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (["alphasubcolor", "alphasubcard"].includes(key)) {
			if (parseFloat(value) < 0 && parseFloat(value) > 1)
				return message.reply(getLang("invalidAlpha"));
			oldDesign.alpha_subcard = parseFloat(value);
			try {
				await threadsData.set(event.threadID, {
					data
				});
				message.reply(getLang("success"));
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (key == "reset") {
			data.customRankCard = {};
			try {
				await threadsData.set(event.threadID, {
					data
				});
				message.reply(getLang("success") + " (reset)");
			}
			catch (err) {
				message.err(err);
			}
		}
		else
			message.SyntaxError();
	}
};