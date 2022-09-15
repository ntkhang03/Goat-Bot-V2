module.exports = {
	config: {
		name: "setrole",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Chỉnh sửa role của lệnh",
		longDescription: "Chỉnh sửa role của lệnh (những lệnh có role < 2)",
		category: "info",
		guide: "{pn} {{<commandName> <new role>}}: set role mới cho lệnh"
			+ "\nVới:"
			+ "\n + <{{commandName}}>: tên lệnh"
			+ "\n + <{{new role}}>: role mới của lệnh với:"
			+ "\n + <{{new role}}> = 0: lệnh có thể được sử dụng bởi mọi thành viên trong nhóm"
			+ "\n + <{{new role}}> = 1: lệnh chỉ có thể được sử dụng bởi quản trị viên"
			+ "\n + <{{new role}}> = {{default}}: reset role lệnh về mặc định"
			+ "\nVí dụ:"
			+ "\n   {pn} {{rank 1:}} (lệnh {{rank}} sẽ chỉ có thể được sử dụng bởi quản trị viên)"
			+ "\n   {pn} {{rank 0:}} (lệnh {{rank}} sẽ có thể được sử dụng bởi mọi thành viên trong nhóm)"
			+ "\n   {pn} {{rank default:}} reset về mặc định"
			+ "\n—————"
			+ "\n{pn} {{[viewrole|view|show]}}: xem role của những lệnh đã chỉnh sửa"

	},

	onStart: async function ({ message, event, args, role, threadsData }) {
		const { commands, aliases } = global.GoatBot;
		const setRole = await threadsData.get(event.threadID, "data.setRole", {});

		if (["view", "viewrole", "show"].includes(args[0])) {
			if (!setRole || Object.keys(setRole).length === 0)
				return message.reply("✅ Hiện tại nhóm bạn không có lệnh nào được chỉnh sửa role");
			let msg = "⚠️ Những lệnh trong nhóm bạn đã chỉnh sửa role:\n";
			for (const cmd in setRole) msg += `- {{${cmd}}} => ${setRole[cmd]}\n`;
			return message.reply(msg);
		}

		let commandName = (args[0] || "").toLowerCase();
		let newRole = args[1];
		if (!commandName || (isNaN(newRole) && newRole !== "default"))
			return message.SyntaxError();
		if (role < 1)
			return message.reply("❗ Chỉ có quản trị viên mới có thể thực hiện lệnh này");

		const command = commands.get(commandName) || commands.get(aliases.get(commandName));
		if (!command)
			return message.reply(`Không tìm thấy lệnh "{{${commandName}}}"`);
		commandName = command.config.name;
		if (command.config.role > 1)
			return message.reply(`❗ Không thể thay đổi role của lệnh "{{${commandName}}}"`);

		let Default = false;
		if (newRole === "default" || newRole == command.config.role) {
			Default = true;
			newRole = command.config.role;
		}
		newRole = parseInt(newRole);

		setRole[commandName] = newRole;
		if (Default)
			delete setRole[commandName];
		await threadsData.get(event.threadID, setRole, "data.setRole");
		message.reply("✅ " + (Default === true ? `Đã reset role của lệnh "{{${commandName}}}" về mặc định` : `Đã thay đổi role của lệnh "{{${commandName}}}" thành ${newRole}`));
	}
};