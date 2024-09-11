const { readdirSync, readFileSync, writeFileSync, existsSync } = require("fs-extra");
const path = require("path");
const exec = (cmd, options) => new Promise((resolve, reject) => {
	require("child_process").exec(cmd, options, (err, stdout) => {
		if (err)
			return reject(err);
		resolve(stdout);
	});
});
const { log, loading, getText, colors, removeHomeDir } = global.utils;
const { GoatBot } = global;
const { configCommands } = GoatBot;
const regExpCheckPackage = /require(\s+|)\((\s+|)[`'"]([^`'"]+)[`'"](\s+|)\)/g;
const packageAlready = [];
// const spinner = '\\|/-';
const spinner = [
	'⠋', '⠙', '⠹',
	'⠸', '⠼', '⠴',
	'⠦', '⠧', '⠇',
	'⠏'
];
let count = 0;

module.exports = async function (api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, createLine) {
	/* { CHECK ORIGIN CODE } */

	const aliasesData = await globalData.get('setalias', 'data', []);
	if (aliasesData) {
		for (const data of aliasesData) {
			const { aliases, commandName } = data;
			for (const alias of aliases)
				if (GoatBot.aliases.has(alias))
					throw new Error(`Alias "${alias}" already exists in command "${commandName}"`);
				else
					GoatBot.aliases.set(alias, commandName);
		}
	}
	const folders = ["cmds", "events"];
	let text, setMap, typeEnvCommand;

	for (const folderModules of folders) {
		const makeColor = folderModules == "cmds" ?
			createLine("LOAD COMMANDS") :
			createLine("LOAD COMMANDS EVENT");
		console.log(colors.hex("#f5ab00")(makeColor));

		if (folderModules == "cmds") {
			text = "command";
			typeEnvCommand = "envCommands";
			setMap = "commands";
		}
		else if (folderModules == "events") {
			text = "event command";
			typeEnvCommand = "envEvents";
			setMap = "eventCommands";
		}

		const fullPathModules = path.normalize(process.cwd() + `/scripts/${folderModules}`);
		const Files = readdirSync(fullPathModules)
			.filter(file =>
				file.endsWith(".js") &&
				!file.endsWith("eg.js") && // ignore example file
				(process.env.NODE_ENV == "development" ? true : !file.match(/(dev)\.js$/g)) && // ignore dev file in production mode
				!configCommands[folderModules == "cmds" ? "commandUnload" : "commandEventUnload"]?.includes(file) // ignore unload command
			);

		const commandError = [];
		let commandLoadSuccess = 0;

		for (const file of Files) {
			const pathCommand = path.normalize(fullPathModules + "/" + file);
			try {
				// ————————————————— CHECK PACKAGE ————————————————— //
				const contentFile = readFileSync(pathCommand, "utf8");
				let allPackage = contentFile.match(regExpCheckPackage);
				if (allPackage) {
					allPackage = allPackage.map(p => p.match(/[`'"]([^`'"]+)[`'"]/)[1])
						.filter(p => p.indexOf("/") !== 0 && p.indexOf("./") !== 0 && p.indexOf("../") !== 0 && p.indexOf(__dirname) !== 0);
					for (let packageName of allPackage) {
						// @user/abc => @user/abc
						// @user/abc/dist/xyz.js => @user/abc
						// @user/abc/dist/xyz => @user/abc
						if (packageName.startsWith('@'))
							packageName = packageName.split('/').slice(0, 2).join('/');
						else
							packageName = packageName.split('/')[0];

						if (!packageAlready.includes(packageName)) {
							packageAlready.push(packageName);
							if (!existsSync(`${process.cwd()}/node_modules/${packageName}`)) {
								const wating = setInterval(() => {
									// loading.info('PACKAGE', `${spinner[count % spinner.length]} Installing package ${packageName} for ${text} ${file}`);
									loading.info('PACKAGE', `${spinner[count % spinner.length]} Installing package ${colors.yellow(packageName)} for ${text} ${colors.yellow(file)}`);
									count++;
								}, 80);
								try {
									await exec(`npm install ${packageName} --${pathCommand.endsWith('.dev.js') ? 'no-save' : 'save'}`);
									clearInterval(wating);
									process.stderr.write('\r\x1b[K');
									console.log(`${colors.green('✔')} installed package ${packageName} successfully`);
								}
								catch (err) {
									clearInterval(wating);
									process.stderr.write('\r\x1b[K');
									console.log(`${colors.red('✖')} installed package ${packageName} failed`);
									throw new Error(`Can't install package ${packageName}`);
								}
							}
						}
					}
				}

				// —————————————— CHECK CONTENT SCRIPT —————————————— //
				global.temp.contentScripts[folderModules][file] = contentFile;


				const command = require(pathCommand);
				command.location = pathCommand;
				const configCommand = command.config;
				const commandName = configCommand.name;
				// ——————————————— CHECK SYNTAXERROR ——————————————— //
				if (!configCommand)
					throw new Error(`config of ${text} undefined`);
				if (!configCommand.category)
					throw new Error(`category of ${text} undefined`);
				if (!commandName)
					throw new Error(`name of ${text} undefined`);
				if (!command.onStart)
					throw new Error(`onStart of ${text} undefined`);
				if (typeof command.onStart !== "function")
					throw new Error(`onStart of ${text} must be a function`);
				if (GoatBot[setMap].has(commandName))
					throw new Error(`${text} "${commandName}" already exists with file "${removeHomeDir(GoatBot[setMap].get(commandName).location || "")}"`);
				const { onFirstChat, onChat, onLoad, onEvent, onAnyEvent } = command;
				const { envGlobal, envConfig } = configCommand;
				const { aliases } = configCommand;
				// ————————————————— CHECK ALIASES —————————————————— //
				const validAliases = [];
				if (aliases) {
					if (!Array.isArray(aliases))
						throw new Error("The value of \"config.aliases\" must be array!");
					for (const alias of aliases) {
						if (aliases.filter(item => item == alias).length > 1)
							throw new Error(`alias "${alias}" duplicate in ${text} "${commandName}" with file "${removeHomeDir(pathCommand)}"`);
						if (GoatBot.aliases.has(alias))
							throw new Error(`alias "${alias}" already exists in ${text} "${GoatBot.aliases.get(alias)}" with file "${removeHomeDir(GoatBot[setMap].get(GoatBot.aliases.get(alias))?.location || "")}"`);
						validAliases.push(alias);
					}
					for (const alias of validAliases)
						GoatBot.aliases.set(alias, commandName);
				}
				// ——————————————— CHECK ENV GLOBAL ——————————————— //
				if (envGlobal) {
					if (typeof envGlobal != "object" || typeof envGlobal == "object" && Array.isArray(envGlobal))
						throw new Error("the value of \"envGlobal\" must be object");
					for (const i in envGlobal) {
						if (!configCommands.envGlobal[i]) {
							configCommands.envGlobal[i] = envGlobal[i];
						}
						else {
							const readCommand = readFileSync(pathCommand, "utf-8").replace(envGlobal[i], configCommands.envGlobal[i]);
							writeFileSync(pathCommand, readCommand);
						}
					}
				}
				// ———————————————— CHECK CONFIG CMD ——————————————— //
				if (envConfig) {
					if (typeof envConfig != "object" || typeof envConfig == "object" && Array.isArray(envConfig))
						throw new Error("The value of \"envConfig\" must be object");
					if (!configCommands[typeEnvCommand])
						configCommands[typeEnvCommand] = {};
					if (!configCommands[typeEnvCommand][commandName])
						configCommands[typeEnvCommand][commandName] = {};
					for (const [key, value] of Object.entries(envConfig)) {
						if (!configCommands[typeEnvCommand][commandName][key])
							configCommands[typeEnvCommand][commandName][key] = value;
						else {
							const readCommand = readFileSync(pathCommand, "utf-8").replace(value, configCommands[typeEnvCommand][commandName][key]);
							writeFileSync(pathCommand, readCommand);
						}
					}
				}
				// ————————————————— CHECK ONLOAD ————————————————— //
				if (onLoad) {
					if (typeof onLoad != "function")
						throw new Error("The value of \"onLoad\" must be function");
					await onLoad({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData });
				}
				// ——————————————— CHECK RUN ANYTIME ——————————————— //
				if (onChat)
					GoatBot.onChat.push(commandName);
				// ——————————————— CHECK ONFIRSTCHAT ——————————————— //
				if (onFirstChat)
					GoatBot.onFirstChat.push({ commandName, threadIDsChattedFirstTime: [] });
				// ————————————————— CHECK ONEVENT ————————————————— //
				if (onEvent)
					GoatBot.onEvent.push(commandName);
				// ———————————————— CHECK ONANYEVENT ———————————————— //
				if (onAnyEvent)
					GoatBot.onAnyEvent.push(commandName);
				// —————————————— IMPORT TO GLOBALGOAT —————————————— //
				GoatBot[setMap].set(commandName.toLowerCase(), command);
				commandLoadSuccess++;
				// ————————————————— COMPARE COMMAND (removed in open source) ————————————————— //

				global.GoatBot[folderModules == "cmds" ? "commandFilesPath" : "eventCommandsFilesPath"].push({
					// filePath: pathCommand,
					filePath: path.normalize(pathCommand),
					commandName: [commandName, ...validAliases]
				});
			}
			catch (error) {
				commandError.push({
					name: file,
					error
				});
			}
			loading.info('LOADED', `${colors.green(`${commandLoadSuccess}`)}${commandError.length ? `, ${colors.red(`${commandError.length}`)}` : ''}`);
		}
		console.log("\r");
		if (commandError.length > 0) {
			log.err("LOADED", getText('loadScripts', 'loadScriptsError', colors.yellow(text)));
			for (const item of commandError)
				console.log(` ${colors.red('✖ ' + item.name)}: ${item.error.message}\n`, item.error);
		}
	}
};