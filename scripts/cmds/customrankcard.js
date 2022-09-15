const axios = require("axios");

module.exports = {
	config: {
		name: "customrankcard",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Thiết kế thẻ rank",
		longDescription: "Thiết kế thẻ rank theo ý bạn",
		category: "rank",
		guide: {
			body: "{pn} {{[maincolor | subcolor | expcolor | expnextlevelcolor | alphasubcolor | textcolor | reset]}} <value>\nTrong đó: "
				+ "\n  + {{Maincolor}}: background chính của thẻ rank {{(hex color or rgba or url image)}}"
				+ "\n  + {{Subcolor}}: background phụ {{(hex color or rgba or url image)}}"
				+ "\n  + {{Expcolor}}: màu của thanh exp hiện tại"
				+ "\n  + {{Expnextlevelcolor}}: màu của thanh exp full"
				+ "\n  + {{Alphasubcolor}}: độ mờ của background phụ (từ 0 -> 1)"
				+ "\n  + {{Textcolor}}: màu của chữ {{(hex color or rgba)}}"
				+ "\n Reset: reset về mặc định"
				+ "\n\nVí dụ:"
				+ "\n   {pn} {{maincolor #fff000}}"
				+ "\n   {pn} {{subcolor rgba(255,136,86,0.4)}}"
				+ "\n   {pn} {{reset}}",
			attachment: [__dirname + "/assets/guide/customrankcard/guide1.jpg"]
		}
	},

	onStart: async function ({ message, threadsData, event, args }) {
		if (!args[0] || !args[1])
			return message.SyntaxError();

		const { data } = await threadsData.get(event.threadID);
		if (!data.customRankCard)
			data.customRankCard = {};

		const oldDesign = data.customRankCard;
		const key = args[0].toLowerCase();
		const value = args.slice(1).join(" ");

		const rgbRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
		const checkUrlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
		const hexColorRegex = /^#([0-9a-f]{6})$/i;

		if (["subcolor", "maincolor", "expcolor", "textcolor", "expnextlevelcolor"].includes(key)) {
			if (value.match(checkUrlRegex)) {
				// if image url
				const contentType = (await axios.get(value)).headers["content-type"];
				if (!contentType.includes("image"))
					return message.reply("Url hình ảnh không hợp lệ, vui lòng chọn 1 url với trang đích là hình ảnh");
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
		else if (key == "alphasubcolor" || key == "alphasubcard") {
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