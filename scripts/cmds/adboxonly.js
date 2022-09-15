module.exports = {
	config: {
		name: "onlyadminbox",
		aliases: ["onlyadbox", "adboxonly", "adminboxonly"],
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 1,
		shortDescription: "bật/tắt chỉ admin box sử dụng bot",
		longDescription: "bật/tắt chế độ chỉ quản trị của viên nhóm mới có thể sử dụng bot",
		category: "box chat",
		guide: "{pn} {{[on | off}}]"
	},

	onStart: async function ({ args, message, event, threadsData }) {
		if (args[0] == "on") {
			await threadsData.set(event.threadID, true, "data.onlyAdminBox");
			message.reply("Đã bật chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot");
		}
		else if (args[0] == "off") {
			await threadsData.set(event.threadID, false, "data.onlyAdminBox");
			message.reply("Đã tắt chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot");
		}
		else
			return message.reply("Vui lòng chọn {{on}} hoặc {{off}}");
	}
};