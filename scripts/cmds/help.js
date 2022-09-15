const fs = require("fs-extra");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
/** 
* @author NTKhang
* @author: do not delete it
* @message if you delete or edit it you will get a global ban
*/
const doNotDelete = "[ 🐐 | Goat Bot ]";

module.exports = {
	config: {
		name: "help",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Xem cách dùng lệnh",
		longDescription: "Xem cách sử dụng của các lệnh",
		category: "info",
		guide: "{pn} [để trống | <số trang> | <tên lệnh>]",
		priority: 1
	},

	onStart: async function ({ message, args, event, threadsData }) {
		const { threadID } = event;
		const threadData = await threadsData.get(threadID);
		const prefix = getPrefix(threadID);
		let sortHelp = threadData.settings.sortHelp || "name";
		if (!["category", "name"].includes(sortHelp))
			sortHelp = "name";
		const commandName = (args[0] || "").toLowerCase();
		const command = commands.get(commandName) || commands.get(aliases.get(commandName));
		// ———————————————— LIST ALL COMMAND ——————————————— //
		if (!command && !args[0] || !isNaN(args[0])) {
			const arrayInfo = [];
			let msg = "";
			if (sortHelp == "name") {
				const page = parseInt(args[0]) || 1;
				const numberOfOnePage = 30;
				let i = 0;
				for (let [name, value] of commands) {
					name = `{{${name}}}`;
					value.config.shortDescription && value.config.shortDescription.length < 40 ? name += `: ${value.config.shortDescription.charAt(0).toUpperCase() + value.config.shortDescription.slice(1)}` : "";
					arrayInfo.push({
						data: name,
						priority: value.priority || 0
					});
				}
				arrayInfo.sort((a, b) => a.data - b.data);
				arrayInfo.sort((a, b) => a.priority > b.priority ? -1 : 1);
				const { allPage, totalPage } = global.utils.splitPage(arrayInfo, numberOfOnePage);
				const returnArray = allPage[page - 1];
				const characters = "━━━━━━━━━━━━━";
				msg += (returnArray || []).reduce((text, item) => text += `${++i} ↬ ${item.data}\n`, '');

				await message.reply(`${characters}\n${msg}${characters}`
					+ `\nTrang [ ${page}/${totalPage} ]`
					+ `\nHiện tại bot có ${commands.size} lệnh có thể sử dụng`
					+ `\n» Gõ {{${prefix}help}} <số trang> để xem danh sách lệnh`
					+ `\n» Gõ {{${prefix}help}} <tên lệnh> để xem chi tiết cách sử dụng lệnh đó\n{{${characters}\n${doNotDelete}}}`);
			}
			else if (sortHelp == "category") {
				for (const [name, value] of commands) {
					if (arrayInfo.some(item => item.category == value.config.category.toLowerCase()))
						arrayInfo[arrayInfo.findIndex(item => item.category == value.config.category.toLowerCase())].names.push(`{{${value.config.name}}}`);
					else
						arrayInfo.push({
							category: value.config.category.toLowerCase(),
							names: [`{{${value.config.name}}}`]
						});
				}
				arrayInfo.sort((a, b) => (a.category < b.category ? -1 : 1));
				for (const data of arrayInfo) {
					const categoryUpcase = "━━━ " + data.category.toUpperCase() + " ━━━";
					data.names.sort();
					msg += `${categoryUpcase}\n${data.names.join(", ")}\n\n`;
				}
				const characters = "━━━━━━━━━━━━━";

				message.reply(`{{${msg}}}${characters}`
					+ `\n» Hiện tại bot có ${commands.size} lệnh có thể sử dụng, gõ {{${prefix}help}} <tên lệnh> để xem chi tiết cách sử dụng lệnh đó\n{{${characters}\n${doNotDelete}}}`);
			}
		}
		// ———————————— COMMAND DOES NOT EXIST ———————————— //
		else if (!command && args[0]) {
			return message.reply(`Lệnh "{{${args[0]}}}" không tồn tại`);
		}
		// ————————————————— INFO COMMAND ————————————————— //
		else {
			const configCommand = command.config;
			const author = configCommand.author;

			const nameUpperCase = configCommand.name.toUpperCase();
			const title = `━━━━━━━━━━━━━\n${nameUpperCase}\n━━━━━━━━━━━━━`;

			let msg = `${title}`
				+ `\n» Mô tả: ${configCommand.longDescription || "Không có"}`
				+ `\n» Các tên gọi khác: ${configCommand.aliases ? `{{${configCommand.aliases.join(", ")}}}` : "Không có"}`
				+ `\n» Các tên gọi khác trong nhóm bạn: ${threadData.data.aliases ? `{{${(threadData.data.aliases[configCommand.name] || []).join(", ")}}}` : "Không có"}`
				+ `\n» Version: ${configCommand.version}`
				+ `\n» Role: ${!configCommand.role ? "0 (Tất cả người dùng)" : configCommand.role == 1 ? "1 (Quản trị viên nhóm)" : "2 (Admin bot)"}`
				+ `\n» Thời gian mỗi lần dùng lệnh: ${configCommand.countDown || 1}s`
				// + `\n» Phân loại: ${configCommand.category || "Không có phân loại"}`
				+ `\n» Author: ${author}` || "";
			let guide = configCommand.guide || {
				body: ""
			};
			if (typeof (guide) == "string")
				guide = { body: guide };
			msg += '\n━━━━━━━━━━━━━\n'
				+ '» Hướng dẫn sử dụng:\n'
				+ guide.body
					.replace(/\{prefix\}|\{p\}/g, `{{${prefix}}}`)
					.replace(/\{name\}|\{n\}/g, `{{${configCommand.name}}}`)
					.replace(/\{pn\}/g, prefix + `{{${configCommand.name}}}`)
				+ '\n━━━━━━━━━━━━━\n'
				+ '» Chú thích:\n• Nội dung bên trong {{<XXXXX>}} là có thể thay đổi\n• Nội dung bên trong {{[a|b|c]}} là {{a}} hoặc {{b}} hoặc {{c}}';

			const formSendMessage = {
				body: msg
			};

			if (guide.attachment) {
				if (Array.isArray(guide.attachment)) {
					formSendMessage.attachment = [];
					for (const pathFile of guide.attachment)
						formSendMessage.attachment.push(fs.createReadStream(pathFile));
				}
			}

			return message.reply(formSendMessage);
		}
	}
};