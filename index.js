/** 
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using 
 */
const axios = require("axios");
const chalk = require("chalk");
const { NODE_ENV } = process.env;
process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

const dirConfig = `${__dirname}/config${NODE_ENV === 'development' || NODE_ENV === 'test' ? '.dev.json' : '.json'}`;
const dirConfigCommands = `${__dirname}/configCommands${NODE_ENV === 'development' || NODE_ENV === 'test' ? '.dev.json' : '.json'}`;
const dirAccount = `${__dirname}/account${NODE_ENV === 'development' || NODE_ENV === 'test' ? '.dev.txt' : '.txt'}`;
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

const utils = require("./utils.js");
global.utils = utils;

global.db = {
	allThreadData: [],
	allUserData: [],
	threadModel: null,
	userModel: null,
	userDashboardModel: null,
	threadsData: null,
	usersData: null,
	dashBoardData: null
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
		creatingDashBoardData: []
	},
	commandBanned: configCommands.commandBanned
};

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

// ———————————————————— LOGIN ———————————————————— //
(async () => {
	const { data: { version } } = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/package.json");
	const currentVersion = require("./package.json").version;
	if (compareVersion(version, currentVersion) === 1) {
		if (global.GoatBot.config.language === "vi")
			utils.log.master("NEW UPDATE", `Bạn đang dùng phiên bản ${chalk.grey(version)}, phiên bản mới nhất là ${chalk.hex("#eb6a07")(currentVersion)}. Vui lòng cập nhật để sử dụng bot tốt hơn bằng cách gõ vào console/cmd lệnh: node update`);
		else
			utils.log.master("NEW UPDATE", `You are using version ${config.version}, the latest version is ${version}. Please update to use the bot better by typing the command into the console/cmd: node update`);
	}
	const parentIdGoogleDrive = await utils.drive.checkAndCreateParentFolder("GoatBot");
	utils.drive.parentID = parentIdGoogleDrive;
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
