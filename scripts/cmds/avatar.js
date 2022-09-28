const axios = require('axios');
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "avatar",
		author: "NTKhang",
		version: "1.0",
		cooldowns: 5,
		role: 0,
		shortDescription: "tạo avatar anime",
		longDescription: "tạo avatar anime với chữ ký",
		category: "image",
		guide: "{p}{n} <mã số nhân vật hoặc tên nhân vật> | <chữ nền> | <chữ ký> | <tên màu tiếng anh hoặc mã màu nền (hex color)>"
			+ "\n{p}{n} help: xem cách dùng lệnh"
	},

	onStart: async function ({ args, message }) {
		message.reply(`Đang khởi tạo hình ảnh, vui lòng chờ đợi...`);
		const content = args.join(" ").split("|").map(item => item = item.trim());
		let idNhanVat, tenNhanvat;
		const chu_Nen = content[1];
		const chu_Ky = content[2];
		const colorBg = content[3];
		try {
			const dataChracter = (await axios.get("https://goatbot.me/taoanhdep/listavataranime?apikey=ntkhang")).data.data;
			if (!isNaN(content[0])) {
				idNhanVat = parseInt(content[0]);
				const totalCharacter = dataChracter.length - 1;
				if (idNhanVat > totalCharacter)
					return message.reply(`Hiện tại chỉ có ${totalCharacter} nhân vật trên hệ thống, vui lòng nhập id nhân vật nhỏ hơn`);
				tenNhanvat = dataChracter[idNhanVat].name;
			}
			else {
				const findChracter = dataChracter.find(item => item.name.toLowerCase() == content[0].toLowerCase());
				if (findChracter) {
					idNhanVat = findChracter.stt;
					tenNhanvat = content[0];
				}
				else
					return message.reply(`Không tìm thấy nhân vật mang tên ${content[0]} trong danh sách nhân vật`);
			}
		}
		catch (error) {
			const err = error.response.data;
			return message.reply(`Đã xảy ra lỗi lấy dữ liệu nhân vật:\n${err.error}: ${err.message}`);
		}

		const endpoint = `https://goatbot.me/taoanhdep/avataranime`;
		const params = {
			id: idNhanVat,
			chu_Nen,
			chu_Ky,
			apikey: "ntkhangGoatBot"
		};
		if (colorBg)
			params.colorBg = colorBg;

		try {
			const avatarImage = await getStreamFromURL(endpoint, "avatar.png", { params });
			message.reply({
				body: `✅ Avatar của bạn\nNhân vật: ${tenNhanvat}\nMã số: ${idNhanVat}\nChữ nền: ${chu_Nen}\nChữ ký: ${chu_Ky}\nMàu: ${colorBg || "mặc định"}`,
				attachment: avatarImage
			});
		}
		catch (error) {
			error.response.data.on("data", function (e) {
				const err = JSON.parse(e);
				message.reply(`Đã xảy ra lỗi ${err.error}: ${err.message}`);
			});
		}
	}
};