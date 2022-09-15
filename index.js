/** 
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using 
 */

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
	const parentIdGoogleDrive = await utils.drive.checkAndCreateParentFolder("GoatBot");
	utils.drive.parentID = parentIdGoogleDrive;
	require(`./bot/login/login${NODE_ENV === 'development' ? '.dev.js' : '.js'}`);
})();
