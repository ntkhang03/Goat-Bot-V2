module.exports = {
	config: {
		name: "setalias",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Thêm tên gọi khác cho lệnh",
		longDescription: "Thêm tên gọi khác cho 1 lệnh bất kỳ trong nhóm của bạn",
		category: "config",
		guide: "Lệnh dùng để thêm/xóa tên gọi khác cho 1 lệnh nào đó để tiện sử dụng trong nhóm chat của bạn"
			+ "\n{pn} {{add}} <tên gọi khác> <tên lệnh>: dùng để thêm tên gọi khác cho lệnh"
			+ "\nVí dụ: {pn} ctrk customrankcard"
			+ "\n\n{pn} {{[remove | rm]}} <tên gọi khác> <tên lệnh>: dùng để xóa tên gọi khác của lệnh"
			+ "\nVí dụ: {pn} rm ctrk customrankcard"
			+ "\n\n{pn} {{list}}: dùng để xem danh sách tên gọi khác của các lệnh trong nhóm bạn"
	},

	onStart: async function ({ message, event, args, threadsData }) {
		const aliasesData = await threadsData.get(event.threadID, "data.aliases", {});

		switch (args[0]) {
			case "add": {
				if (!args[2])
					return message.SyntaxError();
				const commandName = args[2].toLowerCase();
				if (!global.GoatBot.commands.has(commandName))
					return message.reply(`❌ Lệnh {{"${commandName}"}} không tồn tại`);
				const alias = args[1].toLowerCase();

				for (const cmdName in aliasesData)
					if (aliasesData[cmdName].includes(alias))
						return message.reply(`❌ Tên gọi {{"${alias}"}} đã tồn tại cho lệnh {{${cmdName}}} `);
				if (global.GoatBot.commands.get(alias))
					return message.reply(`❌ Tên gọi {{"${alias}"}} trùng với tên lệnh khác trong hệ thống bot`);
				if (global.GoatBot.aliases.get(alias))
					return message.reply(`❌ Tên gọi {{"${alias}"}} trùng với một tên gọi của lệnh khác trong hệ thống bot`);

				const oldAlias = aliasesData[commandName] || [];
				oldAlias.push(alias);
				aliasesData[commandName] = oldAlias;
				await threadsData.set(event.threadID, aliasesData, "data.aliases");
				return message.reply(`✅ Đã thêm tên gọi {{"${alias}"}} cho lệnh {{"${commandName}"}} `);
			}
			case "remove":
			case "rm": {
				if (!args[2])
					return message.SyntaxError();
				const commandName = args[2].toLowerCase();
				if (!global.GoatBot.commands.has(commandName))
					return message.reply(`❌ Lệnh {{"${commandName}"}} không tồn tại`);
				const oldAlias = aliasesData[commandName];
				if (!oldAlias)
					return message.reply(`❌ Lệnh {{"${commandName}"}} không có tên gọi khác nào trong nhóm của bạn`);
				const alias = args[1].toLowerCase();
				const index = oldAlias.indexOf(alias);
				if (index === -1)
					return message.reply(`❌ Tên gọi {{"${alias}"}} không tồn tại trong lệnh {{"${commandName}"}} `);
				oldAlias.splice(index, 1);
				await threadsData.set(event.threadID, aliasesData, "data.aliases");
				return message.reply(`✅ Đã xóa tên gọi {{"${alias}"}} khỏi lệnh {{"${commandName}"}} `);
			}
			case "list": {
				if (!Object.keys(aliasesData).length)
					return message.reply("❌ Nhóm bạn chưa cài đặt tên gọi khác cho kệnh nào cả");
				const list = Object.keys(aliasesData).map(commandName => `\n - ${commandName}: ${aliasesData[commandName].join(", ")} `);
				return message.reply(`Tên gọi khác của các lệnh trong nhóm bạn: ${list.join("\n")} `);
			}
			default: {
				return message.SyntaxError();
			}
		}
	}
};