module.exports = {
	config: {
		name: "setalias",
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Thêm tên gọi khác cho lệnh",
		longDescription: "Thêm tên gọi khác cho 1 lệnh bất kỳ trong nhóm của bạn",
		category: "config",
		guide: "Lệnh dùng để thêm/xóa tên gọi khác cho 1 lệnh nào đó để tiện sử dụng trong nhóm chat của bạn"
			+ "\n{pn} {{add}} <tên gọi khác> <tên lệnh>: dùng để thêm tên gọi khác cho lệnh trong nhóm chat của bạn"
			+ "\n{pn} {{add}} <tên gọi khác> <tên lệnh> -g: dùng để thêm tên gọi khác cho lệnh trong toàn hệ thống (chỉ admin bot)"
			+ "\nVí dụ: {pn} {{ctrk customrankcard}}"
			+ "\n\n{pn} {{[remove | rm]}} <tên gọi khác> <tên lệnh>: dùng để xóa tên gọi khác của lệnh trong nhóm chat của bạn"
			+ "\n{pn} {{[remove | rm]}} <tên gọi khác> <tên lệnh> -g: dùng để xóa tên gọi khác của lệnh trong toàn hệ thống (chỉ admin bot)"
			+ "\nVí dụ: {pn} {{rm ctrk customrankcard}}"
			+ "\n\n{pn} {{list}}: dùng để xem danh sách tên gọi khác của các lệnh trong nhóm bạn"
			+ "\n{pn} {{list -g}}: dùng để xem danh sách tên gọi khác của các lệnh trong nhóm bạn"
	},

	onLoad: async function ({ globalData }) {
		if (!await globalData.get('setalias'))
			await globalData.create('setalias', {
				key: 'setalias',
				data: []
			});
	},

	onStart: async function ({ message, event, args, threadsData, globalData, role }) {
		const aliasesData = await threadsData.get(event.threadID, "data.aliases", {});

		switch (args[0]) {
			case "add": {
				if (!args[2])
					return message.SyntaxError();
				const commandName = args[2].toLowerCase();
				if (!global.GoatBot.commands.has(commandName))
					return message.reply(`❌ Lệnh {{"${commandName}"}} không tồn tại`);
				const alias = args[1].toLowerCase();

				if (args[3] == '-g') {
					if (role > 1) {
						const globalAliasesData = await globalData.get('setalias', 'data', []);
						const globalAliasesExist = globalAliasesData.find(item => item.aliases.includes(alias));
						if (globalAliasesExist)
							return message.reply(`❌ Tên gọi {{"${alias}"}} đã tồn tại cho lệnh {{"${globalAliasesExist.commandName}"}} trong hệ thống`);
						if (global.GoatBot.alias.has(alias))
							return message.reply(`❌ Tên gọi {{"${alias}"}} đã tồn tại cho lệnh {{"${global.GoatBot.alias.get(alias)}"}} trong hệ thống`);
						const globalAliasesThisCommand = globalAliasesData.find(aliasData => aliasData.commandName == commandName);
						if (globalAliasesThisCommand)
							globalAliasesData.aliases.push(alias);
						else
							globalAliasesData.push({
								commandName,
								aliases: [alias]
							});
						await globalData.set('setalias', 'data', globalAliasesData);
						global.GoatBot.aliases.set(alias, commandName);
						return message.reply(`✅ Đã thêm tên gọi {{"${alias}"}} cho lệnh {{"${commandName}"}} trong hệ thống`);
					}
					else {
						return message.reply(`❌ Bạn không có quyền thêm tên gọi {{"${alias}"}} cho lệnh {{"${commandName}"}} trong hệ thống`);
					}
				}

				if (global.GoatBot.commands.get(alias))
					return message.reply(`❌ Tên gọi {{"${alias}"}} trùng với tên lệnh khác trong hệ thống bot`);
				if (global.GoatBot.aliases.has(alias))
					return message.reply(`❌ Tên gọi {{"${alias}"}} đã tồn tại cho lệnh {{"${global.GoatBot.aliases.get(alias)}"}} trong hệ thống`);
				for (const cmdName in aliasesData)
					if (aliasesData[cmdName].includes(alias))
						return message.reply(`❌ Tên gọi {{"${alias}"}} đã tồn tại cho lệnh {{"${cmdName}"}} trong nhóm này`);

				const oldAlias = aliasesData[commandName] || [];
				oldAlias.push(alias);
				aliasesData[commandName] = oldAlias;
				await threadsData.set(event.threadID, aliasesData, "data.aliases");
				return message.reply(`✅ Đã thêm tên gọi {{"${alias}"}} cho lệnh {{"${commandName}"}} trong nhóm chat của bạn`);
			}
			case "remove":
			case "rm": {
				if (!args[2])
					return message.SyntaxError();
				const commandName = args[2].toLowerCase();
				const alias = args[1].toLowerCase();

				if (!global.GoatBot.commands.has(commandName))
					return message.reply(`❌ Lệnh {{"${commandName}"}} không tồn tại`);

				if (args[3] == '-g') {
					if (role > 1) {
						const globalAliasesData = await globalData.get('setalias', 'data', []);
						const globalAliasesThisCommand = globalAliasesData.find(aliasData => aliasData.commandName == commandName);
						if (!globalAliasesThisCommand || !globalAliasesThisCommand.aliases.includes(alias))
							return message.reply(`❌ Tên gọi {{"${alias}"}} không tồn tại cho lệnh {{"${commandName}"}}`);
						globalAliasesThisCommand.aliases.splice(globalAliasesThisCommand.aliases.indexOf(alias), 1);
						await globalData.set('setalias', 'data', globalAliasesData);
						global.GoatBot.aliases.delete(alias);
						return message.reply(`✅ Đã xóa tên gọi {{"${alias}"}} cho lệnh {{"${commandName}"}} trong hệ thống`);
					}
					else {
						return message.reply(`❌ Bạn không có quyền xóa tên gọi {{"${alias}"}} cho lệnh {{"${commandName}"}} trong hệ thống`);
					}
				}

				const oldAlias = aliasesData[commandName];
				if (!oldAlias)
					return message.reply(`❌ Lệnh {{"${commandName}"}} không có tên gọi khác nào trong nhóm của bạn`);
				const index = oldAlias.indexOf(alias);
				if (index === -1)
					return message.reply(`❌ Tên gọi {{"${alias}"}} không tồn tại trong lệnh {{"${commandName}"}} `);
				oldAlias.splice(index, 1);
				await threadsData.set(event.threadID, aliasesData, "data.aliases");
				return message.reply(`✅ Đã xóa tên gọi {{"${alias}"}} khỏi lệnh {{"${commandName}"}} trong nhóm chat của bàn`);
			}
			case "list": {
				if (args[1] == '-g') {
					const globalAliasesData = await globalData.get('setalias', 'data', []);
					const globalAliases = globalAliasesData.map(aliasData => {
						return {
							commandName: aliasData.commandName,
							aliases: aliasData.aliases.join(', ')
						};
					});
					return message.reply(globalAliases.length ? `📜 Danh sách tên gọi khác của các lệnh trong hệ thống:\n${globalAliases.map(alias => `• ${alias.commandName}: ${alias.aliases}`).join('\n')}` : '⚠️ Hiện tại không có tên gọi nào trong hệ thống');
				}

				if (!Object.keys(aliasesData).length)
					return message.reply("⚠️ Nhóm bạn chưa cài đặt tên gọi khác cho kệnh nào cả");
				const list = Object.keys(aliasesData).map(commandName => `\n• ${commandName}: ${aliasesData[commandName].join(", ")} `);
				return message.reply(`Tên gọi khác của các lệnh trong nhóm bạn: ${list.join("\n")} `);
			}
			default: {
				return message.SyntaxError();
			}
		}
	}
};