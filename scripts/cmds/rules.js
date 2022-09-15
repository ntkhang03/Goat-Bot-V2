module.exports = {
	config: {
		name: "rules",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Quy tắc của nhóm",
		longDescription: "Tạo/xem/thêm/sửa/đổi vị trí/xóa nội quy nhóm của bạn",
		category: "box chat",
		guide: "{pn} {{[add | -a]}} <nội quy muốn thêm>: thêm nội quy cho nhóm."
			+ "\n{pn}: xem nội quy của nhóm."
			+ "\n{pn} {{[edit | -e]}} <{{n}}> <nội dung sau khi sửa>: chỉnh sửa lại nội quy thứ {{n}}."
			+ "\n{pn} {{[move | -m]}} <stt1> <stt2> hoán đổi vị trí của nội quy thứ <stt1> và <stt2> với nhau."
			+ "\n{pn} {{[delete | -d]}} <{{n}}>: xóa nội quy theo số thứ tự thứ {{n}}."
			+ "\n{pn} {{[remove | -r]}}: xóa tất cả nội quy của nhóm."
			+ "\n"
			+ "\n- Ví dụ:"
			+ "\n   {pn} {{add không spam}}"
			+ "\n   {pn} {{move 1 3}}"
			+ "\n   {pn} {{-e 1 không spam tin nhắn trong nhóm}}"
			+ "\n   {pn} {{-r}}"
	},

	onStart: async function ({ role, args, message, event, threadsData }) {
		const { threadID, senderID } = event;
		const { getPrefix } = global.utils;

		const type = args[0];
		const rulesOfThread = await threadsData.get(threadID, "data.rules", []);
		const totalRules = rulesOfThread.length;

		if (!type) {
			let i = 1;
			const msg = rulesOfThread.reduce((text, rules) => text += `${i++}. ${rules}\n`, "");
			message.reply(msg ? `Nội quy của nhóm bạn:\n{{${msg}}}` : `Hiện tại nhóm bạn chưa có bất kỳ nội quy nào, để thêm nội quy cho nhóm hãy sử dụng \`${getPrefix(threadID)}rules add\``);
		}
		else if (["add", "-a"].includes(type)) {
			if (role < 1)
				return message.reply("Chỉ quản trị viên mới có thể thêm nội quy cho nhóm");
			if (!args[1])
				return message.reply("Vui lòng nhập nội dung cho nội quy bạn muốn thêm");
			rulesOfThread.push(args.slice(1).join(" "));
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				message.reply(`Đã thêm nội quy mới cho nhóm thành công`);
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (["edit", "-e"].includes(type)) {
			if (role < 1)
				return message.reply("Chỉ quản trị viên mới có thể chỉnh sửa nội quy nhóm");
			const stt = parseInt(args[1]);
			if (stt === NaN)
				return message.reply(`Vui lòng nhập số thứ tự của quy định bạn muốn chỉnh sửa`);
			if (!rulesOfThread[stt - 1])
				return message.reply(`Không tồn tại nội quy thứ ${stt}, hiện tại nhóm bạn ${totalRules == 0 ? `chưa có nội quy nào được đặt ra` : `chỉ có ${totalRules} nội quy`}`);
			if (!args[2])
				return message.reply(`Vui lòng nhập nội dung bạn muốn thay đổi cho nội quy thứ ${stt}`);
			const newContent = args.slice(2).join(" ");
			rulesOfThread[stt - 1] = newContent;
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				message.reply(`Đã chỉnh sửa nội quy thứ ${stt} thành: {{${newContent}}}`);
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (["move", "-m"].includes(type)) {
			if (role < 1)
				return message.reply("Chỉ quản trị viên mới có thể đổi vị trí nội quy của nhóm");
			const stt1 = parseInt(args[1]);
			const stt2 = parseInt(args[2]);
			if (isNaN(stt1) || isNaN(stt2))
				return message.reply(`Vui lòng nhập số thứ tự của 2 nội quy nhóm bạn muốn chuyển đổi vị trí với nhau`);
			if (!rulesOfThread[stt1 - 1] || !rulesOfThread[stt2 - 1])
				return message.reply(`Không tồn tại nội quy thứ ${!rulesOfThread[stt1 - 1] ? (stt1 + (!rulesOfThread[stt2 - 1] ? ` và ${stt2}` : '')) : stt2}, hiện tại nhóm bạn ${totalRules == 0 ? `chưa có nội quy nào được đặt ra` : `chỉ có ${totalRules} nội quy`}`);
			[rulesOfThread[stt1 - 1], rulesOfThread[stt2 - 1]] = [rulesOfThread[stt2 - 1], rulesOfThread[stt1 - 1]];
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				message.reply(`Đã chuyển đổi vị trí của 2 nội quy thứ ${stt1} và ${stt2}`);
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (["delete", "del", "-d"].includes(type)) {
			if (role < 1)
				return message.reply("Chỉ quản trị viên mới có thể xóa nội quy của nhóm");
			if (!args[1] || isNaN(args[1]))
				return message.reply("Vui lòng nhập số thứ tự của nội quy bạn muốn xóa");
			const rulesDel = rulesOfThread[parseInt(args[1]) - 1];
			if (!rulesDel)
				return message.reply(`Không tồn tại nội quy thứ ${args[1]}, hiện tại nhóm bạn có ${totalRules} nội quy`);
			rulesOfThread.splice(parseInt(args[1]) - 1, 1);
			await threadsData.set(threadID, rulesOfThread, "data.rules");
			message.reply(`Đã xóa nội quy thứ ${args[1]} của nhóm, nội dung: ${rulesDel}`);
		}
		else if (["remove", "reset", "-r", "-rm"].includes(type)) {
			if (role < 1)
				return message.reply("Chỉ có quản trị viên nhóm mới có thể xoá bỏ tất cả nội quy của nhóm");
			message.reply("⚠️ Thả cảm xúc bất kỳ vào tin nhắn này để xác nhận xóa toàn bộ nội quy của nhóm", (err, info) => {
				global.GoatBot.onReaction.push({
					commandName: "rules",
					messageID: info.messageID,
					author: senderID
				});
			});
		}
		else if (!isNaN(type)) {
			let msg = "";
			for (const stt of args) {
				const rules = rulesOfThread[parseInt(stt) - 1];
				if (rules)
					msg += `${stt}. ${rules}\n`;
			}
			message.reply(msg || `Không tồn tại nội quy thứ ${type}, hiện tại nhóm bạn ${totalRules == 0 ? `chưa có nội quy nào được đặt ra` : `chỉ có ${totalRules} nội quy`}`);
		}
		else {
			message.SyntaxError();
		}
	},

	onReaction: async ({ threadsData, message, Reaction, event }) => {
		const { author } = Reaction;
		const { threadID, userID } = event;
		if (author != userID)
			return;
		try {
			await threadsData.set(threadID, [], "data.rules");
			message.reply(`✅ Đã xóa toàn bộ nội quy của nhóm thành công`);
		}
		catch (err) {
			message.reply(`❌ Đã xảy ra lỗi: {{${err.name}\n${err.message}}}`);
		}
	}
};
