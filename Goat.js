/** 
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using 
 */
const axios = require("axios");
const chalk = require("chalk");
const fs = require("fs-extra");

const { NODE_ENV } = process.env;
process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));
const dirConfig = `${__dirname}/config${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`;
const dirConfigCommands = `${__dirname}/configCommands${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`;
const dirAccount = `${__dirname}/account${['production', 'development'].includes(NODE_ENV) ? '.dev.txt' : '.txt'}`;
const config = require(dirConfig);
const configCommands = require(dirConfigCommands);

global.GoatBot = {
	commands: new Map(),
	eventCommands: new Map(),
	aliases: new Map(),
	onChat: [],
	onEvent: [],
	onReply: new Map(),
	onReaction: new Map(),
	config,
	configCommands,
	envCommands: {},
	envEvents: {},
	envGlobal: {}
};

global.db = {
	allThreadData: [],
	allUserData: [],
	threadModel: null,
	userModel: null,
	dashboardModel: null,
	globalModel: null,
	threadsData: null,
	usersData: null,
	dashBoardData: null,
	globalData: null,
	receivedTheFirstMessage: {}
};

global.client = {
	dirConfig,
	dirConfigCommands,
	dirAccount,
	countDown: {},
	cache: {},
	database: {
		creatingThreadData: [],
		creatingUserData: [],
		creatingDashBoardData: [],
		creatingGlobalData: []
	},
	commandBanned: configCommands.commandBanned
};

const utils = require("./utils.js");
global.utils = utils;

global.temp = {
	createThreadData: [],
	createUserData: [],
	createThreadDataError: [], // Can't get info of groups with instagram members
	filesOfGoogleDrive: {
		arraybuffer: {},
		stream: {},
		fileNames: {}
	}
};

// ———————————————— LOAD LANGUAGE ———————————————— //
let pathLanguageFile = `${__dirname}/languages/${global.GoatBot.config.language}.lang`;
if (!fs.existsSync(pathLanguageFile)) {
	utils.log.warn("LANGUAGE", `Can't find language file ${global.GoatBot.config.language}.lang, using default language file "${__dirname}/languages/en.lang"`);
	pathLanguageFile = `${__dirname}/languages/en.lang`;
}
const readLanguage = fs.readFileSync(pathLanguageFile, "utf-8");
const languageData = readLanguage
	.split(/\r?\n|\r/)
	.filter(line => line && !line.trim().startsWith("#") && !line.trim().startsWith("//") && line != "");

global.language = convertLangObj(languageData);
function convertLangObj(languageData) {
	const obj = {};
	for (const sentence of languageData) {
		const getSeparator = sentence.indexOf('=');
		const itemKey = sentence.slice(0, getSeparator).trim();
		const itemValue = sentence.slice(getSeparator + 1, sentence.length).trim();
		const head = itemKey.slice(0, itemKey.indexOf('.'));
		const key = itemKey.replace(head + '.', '');
		const value = itemValue.replace(/\\n/gi, '\n');
		if (!obj[head])
			obj[head] = {};
		obj[head][key] = value;
	}
	return obj;
}

function getText(head, key, ...args) {
	let langObj;
	if (typeof head == "object") {
		let pathLanguageFile = `${__dirname}/languages/${head.lang}.lang`;
		head = head.head;
		if (!fs.existsSync(pathLanguageFile)) {
			utils.log.warn("LANGUAGE", `Can't find language file ${pathLanguageFile}, using default language file "${__dirname}/languages/en.lang"`);
			pathLanguageFile = `${__dirname}/languages/en.lang`;
		}
		const readLanguage = fs.readFileSync(pathLanguageFile, "utf-8");
		const languageData = readLanguage
			.split(/\r?\n|\r/)
			.filter(line => line && !line.trim().startsWith("#") && !line.trim().startsWith("//") && line != "");
		langObj = convertLangObj(languageData);
	}
	else {
		langObj = global.language;
	}
	if (!langObj[head]?.hasOwnProperty(key))
		return `Can't find text: "${head}.${key}"`;
	let text = langObj[head][key];
	for (let i = args.length - 1; i >= 0; i--)
		text = text.replace(new RegExp(`%${i + 1}`, 'g'), args[i]);
	return text;
}
global.utils.getText = getText;

// ———————————————— AUTO RESTART ———————————————— //
if (config.autoRestart) {
	const time = config.autoRestart.time;
	if (!isNaN(time) && time > 0) {
		utils.log.info("AUTO RESTART", getText("Goat", "autoRestart1", time / 1000));
		setTimeout(() => {
			utils.log.info("AUTO RESTART", "Restarting...");
			process.exit(2);
		}, time);
	}
	else if (typeof time == "string" && time.match(/^((((\d+,)+\d+|(\d+(\/|-|#)\d+)|\d+L?|\*(\/\d+)?|L(-\d+)?|\?|[A-Z]{3}(-[A-Z]{3})?) ?){5,7})$/gmi)) {
		utils.log.info("AUTO RESTART", getText("Goat", "autoRestart2", time));
		const cron = require("node-cron");
		cron.schedule(time, () => {
			utils.log.info("AUTO RESTART", "Restarting...");
			process.exit(2);
		});
	}
}

(async () => {
	// ———————————————— CHECK VERSION ———————————————— //
	const { data: { version } } = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/package.json");
	const currentVersion = require("./package.json").version;
	if (compareVersion(version, currentVersion) === 1)
		utils.log.master("NEW VERSION", getText("Goat", "newVersionDetected", chalk.grey(currentVersion), chalk.hex("#eb6a07")(version)));
	// —————————— CHECK FOLDER GOOGLE DRIVE —————————— //
	const parentIdGoogleDrive = await utils.drive.checkAndCreateParentFolder("GoatBot");
	utils.drive.parentID = parentIdGoogleDrive;
	// ———————————————————— LOGIN ———————————————————— //
	require(`./bot/login/login${NODE_ENV === 'development' ? '.dev.js' : '.js'}`);
})();

function compareVersion(version1, version2) {
	const v1 = version1.split(".");
	const v2 = version2.split(".");
	for (let i = 0; i < 3; i++) {
		if (parseInt(v1[i]) > parseInt(v2[i])) return 1;
		if (parseInt(v1[i]) < parseInt(v2[i])) return -1;
	}
	return 0;
}
