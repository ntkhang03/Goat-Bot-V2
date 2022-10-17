const axios = require("axios");
const rgbRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
const checkUrlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const hexColorRegex = /^#([0-9a-f]{6})$/i;

module.exports = {
	config: {
		name: "customrankcard",
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Thiết kế thẻ rank",
		longDescription: "Thiết kế thẻ rank theo ý bạn",
		category: "rank",
		guide: {
			body: "{pn} {{[maincolor | subcolor | expcolor | expnextlevelcolor | alphasubcolor | textcolor | reset]}} <value>"
				+ "\nTrong đó: "
				+ "\n  + {{maincolor | background}}: background chính của thẻ rank {{(hex color or rgba or url image)}}"
				+ "\n  + {{subcolor}}: background phụ {{(hex color or rgba or url image)}}"
				+ "\n  + {{expcolor}}: màu của thanh exp hiện tại"
				+ "\n  + {{expnextlevelcolor}}: màu của thanh exp full"
				+ "\n  + {{alphasubcolor}}: độ mờ của background phụ (từ 0 -> 1)"
				+ "\n  + {{textcolor}}: màu của chữ {{(hex color or rgba)}}"
				+ "\n Reset: reset về mặc định"
				+ "\n\nVí dụ:"
				+ "\n   {pn} {{maincolor #fff000}}"
				+ "\n   {pn} {{subcolor rgba(255,136,86,0.4)}}"
				+ "\n   {pn} {{reset}}",
			attachment: [__dirname + "/assets/guide/customrankcard/guide1.jpg"]
		}
	},

	onStart: async function ({ message, threadsData, event, args }) {
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
					return message.reply("Url hình ảnh không hợp lệ, vui lòng chọn 1 url với trang đích là hình ảnh");
			}
			else if (event.messageReply && event.messageReply.attachments?.length > 0) {
				// if image attachment
				if (!["photo", "animated_image"].includes(event.messageReply.attachments[0].type))
					return message.reply("File đính kèm không phải là hình ảnh");
				value = event.messageReply.attachments[0].url;
			}
			else {
				// if color
				if (!value.match(rgbRegex) && !value.match(hexColorRegex))
					return message.reply("Mã màu không hợp lệ, vui lòng nhập mã hex color (6 chữ số) hoặc mã màu rgba");
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
				message.reply("Đã lưu thay đổi của bạn");
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (["alphasubcolor", "alphasubcard"].includes(key)) {
			if (parseFloat(value) < 0 && parseFloat(value) > 1)
				return message.reply("Vui lòng chọn chỉ số trong khoảng từ 0 -> 1");
			oldDesign.alpha_subcard = parseFloat(value);
			try {
				await threadsData.set(event.threadID, {
					data
				});
				message.reply("Đã lưu thay đổi của bạn");
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
				message.reply("Đã lưu thay đổi của bạn {{(reset)}}");
			}
			catch (err) {
				message.err(err);
			}
		}
		else
			message.SyntaxError();
	}
};