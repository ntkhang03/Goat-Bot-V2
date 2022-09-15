module.exports = {
	config: {
		name: "sorthelp",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Sắp xếp danh sách help",
		longDescription: "Sắp xếp danh sách help",
		category: "image",
		guide: "{pn} {{[name|category]}}"
	},

	onStart: async function ({ message, event, args, threadsData }) {
		if (args[0] == "name") {
			await threadsData.set(event.threadID, "name", "settings.sortHelp");
			message.reply("Đã lưu cài đặt sắp xếp danh sách help theo thứ tự chữ cái");
		}
		else if (args[0] == "category") {
			threadsData.set(event.threadID, "category", "settings.sortHelp");
			message.reply("Đã lưu cài đặt sắp xếp danh sách help theo thứ tự nhóm");
		}
		else message.SyntaxError();
	}
};