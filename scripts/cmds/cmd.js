const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const { client } = global;

const { configCommands } = global.GoatBot;
const { log, loading } = global.utils;

module.exports = {
	config: {
		name: "cmd",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: "Quản lý command",
		longDescription: "Quản lý các tệp lệnh của bạn",
		category: "owner",
		guide: "{pn} {{load}} <tên file lệnh>"
			+ "\n{pn} {{loadAll}}"
	},

	onStart: ({ args, message, api, threadModel, userModel, threadsData, usersData }) => {
		if (args[0] == "load") {
			if (!args[1])
				return message.reply("⚠️ | Vui lòng nhập vào tên lệnh bạn muốn reload");
			const infoLoad = loadScripts("cmds", args[1], log, configCommands, api, threadModel, userModel, threadsData, usersData);
			infoLoad.status == "success" ?
				message.reply(`✅ | Đã load command {{${infoLoad.name}}} thành công`)
				: message.reply(`❌ | Load command {{${infoLoad.name}}} thất bại với lỗi\n${infoLoad.error.stack}`);
		}
		else if (args[0].toLowerCase() == "loadall" || (args[0] == "load" && args.length > 2)) {
			const allFile = args[0].toLowerCase() == "loadall" ? fs.readdirSync(__dirname)
				.filter(item => item.endsWith(".js"))
				.map(item => item = item.split(".")[0]) : args.slice(1);
			const arraySucces = [];
			const arrayFail = [];
			for (const name of allFile) {
				const infoLoad = loadScripts("cmds", name, log, configCommands, api, threadModel, userModel, threadsData, usersData);
				infoLoad.status == "success" ? arraySucces.push(name) : arrayFail.push(`{{${name}: ${infoLoad.error.name}: ${infoLoad.error.stack.split("\n").slice(0, 5).join("\n")}}}`);
			}
			message.reply(
				arraySucces.length > 0 ? `✅ | Đã load thành công ${arraySucces.length} command` : ""
					+ arrayFail.length > 0 ? `\n\n❌ | Load thất bại ${arrayFail.length} command\n${"❗" + arrayFail.join("\n❗ ")})` : ""
			);
		}
		else
			message.SyntaxError();
	}
};

const packageAlready = [];
const spinner = "\\|/-";
let count = 0;

function loadScripts(folder, fileName, log, configCommands, api, threadModel, userModel, threadsData, usersData) {
	try {
		const regExpCheckPackage = /require(\s+|)\((\s+|)[`'"]([^`'"]+)[`'"](\s+|)\)/g;
		const { GoatBot } = global;
		const { onChat: allOnChat, onEvent: allOnEvent } = GoatBot;
		let setMap, typeEnvCommand;
		if (folder == "cmds") {
			typeEnvCommand = "envCommands";
			setMap = "commands";
		}
		else if (folder == "events") {
			typeEnvCommand = "envEvents";
			setMap = "eventCommands";
		}
		const pathCommand = path.join(__dirname, "..", `${folder}/${fileName}.js`);
		// ————————————————— CHECK PACKAGE ————————————————— //
		if (!fs.existsSync(pathCommand)) {
			const err = new Error(`Không tìm thấy tệp lệnh ${fileName}`);
			err.name = "FileNotFound";
		}
		const contentFile = fs.readFileSync(pathCommand, "utf8");
		let allPackage = contentFile.match(regExpCheckPackage);
		if (allPackage) {
			allPackage = allPackage
				.map(p => p.match(/[`'"]([^`'"]+)[`'"]/)[1])
				.filter(p => p.indexOf("/") !== 0 && p.indexOf("./") !== 0 && p.indexOf("../") !== 0 && p.indexOf(__dirname) !== 0);
			for (const packageName of allPackage) {
				if (!packageAlready.includes(packageName)) {
					packageAlready.push(packageName);
					if (!fs.existsSync(`${process.cwd()}/node_modules/${packageName}`)) {
						let wating;
						try {
							wating = setInterval(() => {
								count++;
								loading.info("PACKAGE", `Installing ${packageName} ${spinner[count % spinner.length]}`);
							}, 80);
							execSync(`npm install ${packageName} --save`, { stdio: "pipe" });
							clearInterval(wating);
							process.stderr.clearLine();
						}
						catch (error) {
							clearInterval(wating);
							process.stderr.clearLine();
							throw new Error(`Can't install package ${packageName}`);
						}
					}
				}
			}
		}
		// ———————————————— GET OLD COMMAND ———————————————— //
		const oldCommand = require(pathCommand);
		const oldCommandName = oldCommand?.config?.name;
		// ————————————————— CHECK ALIASES ————————————————— //
		if (oldCommand.config.aliases) {
			let oldAliases = oldCommand.config.aliases;
			if (typeof oldAliases == "string")
				oldAliases = [oldAliases];
			for (const alias of oldAliases)
				GoatBot.aliases.delete(alias);
		}
		// ——————————————— DELETE OLD COMMAND ——————————————— //
		delete require.cache[require.resolve(pathCommand)];
		// —————————————————————————————————————————————————— //

		// ———————————————— GET NEW COMMAND ———————————————— //
		const command = require(pathCommand);
		const configCommand = command.config;
		if (!configCommand || typeof configCommand != "object")
			throw new Error("config of command must be an object");
		// —————————————————— CHECK SYNTAX —————————————————— //
		const scriptName = configCommand.name;
		// Check onChat function
		const indexOnChat = allOnChat.findIndex(item => item == oldCommandName);
		if (indexOnChat != -1)
			allOnChat.splice(indexOnChat, 1);
		if (command.onChat)
			allOnChat.push(scriptName);
		// Check onEvent function
		const indexOnEvent = allOnEvent.findIndex(item => item == oldCommandName);
		if (indexOnEvent != -1)
			allOnEvent.splice(indexOnEvent, 1);
		if (command.onEvent)
			allOnEvent.push(scriptName);
		// Check onLoad function
		if (command.onLoad)
			command.onLoad(api, threadModel, userModel, threadsData, usersData);
		const { envGlobal, envConfig } = configCommand;
		if (!command.onStart)
			throw new Error('Function onStart is missing!');
		if (typeof command.onStart != "function")
			throw new Error('Function onStart must be a function!');
		if (!scriptName)
			throw new Error('Name of command is missing!');
		// ————————————————— CHECK ALIASES ————————————————— //
		if (configCommand.aliases) {
			let { aliases } = configCommand;
			if (typeof aliases == "string")
				aliases = [aliases];
			for (const alias of aliases) {
				if (GoatBot.aliases.has(alias))
					throw new Error(`Alias "${alias}" is already exist!`);
				GoatBot.aliases.set(alias, scriptName);
			}
		}
		// ————————————————— CHECK ENVCONFIG ————————————————— //
		// env Global
		if (envGlobal) {
			if (typeof envGlobal != "object" || Array.isArray(envGlobal))
				throw new Error("envGlobal must be an object");
			for (const key in envGlobal)
				configCommands.envGlobal[key] = envGlobal[key];
		}
		// env Config
		if (envConfig && typeof envConfig == "object" && !Array.isArray(envConfig)) {
			if (!configCommands[typeEnvCommand][scriptName])
				configCommands[typeEnvCommand][scriptName] = {};
			configCommands[typeEnvCommand][scriptName] = envConfig;
		}
		GoatBot[setMap].delete(oldCommandName);
		GoatBot[setMap].set(scriptName, command);
		fs.writeFileSync(client.dirConfigCommands, JSON.stringify(configCommands, null, 2));
		log.master("LOADED", `Đã load tệp lệnh ${fileName}.js`);
		fs.writeFileSync(global.client.dirConfigCommands, JSON.stringify(configCommands, null, 2));
		return {
			status: "success",
			name: fileName
		};
	}
	catch (err) {
		err.stack ? err.stack = global.utils.removeHomeDir(err.stack) : "";
		fs.writeFileSync(global.client.dirConfigCommands, JSON.stringify(configCommands, null, 2));
		return {
			status: "failed",
			name: fileName,
			error: err
		};
	}
}

global.utils.loadScripts = loadScripts;