const axios = require('axios');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const log = require('./logger/log.js');
let chalk;
try {
	chalk = require("./func/colors.js").colors;
}
catch (e) {
	chalk = require("chalk");
}

const sep = path.sep;
const currentConfig = require('./config.json');
const langCode = currentConfig.language;
const execSync = require('child_process').execSync;

let pathLanguageFile = `${process.cwd()}/languages/${langCode}.lang`;
if (!fs.existsSync(pathLanguageFile)) {
	log.warn("LANGUAGE", `Can't find language file ${langCode}, using default language file "${path.normalize(`${process.cwd()}/languages/en.lang`)}"`);
	pathLanguageFile = `${process.cwd()}/languages/en.lang`;
}
const readLanguage = fs.readFileSync(pathLanguageFile, "utf-8");
const languageData = readLanguage
	.split(/\r?\n|\r/)
	.filter(line => line && !line.trim().startsWith("#") && !line.trim().startsWith("//") && line != "");

global.language = {};
for (const sentence of languageData) {
	const getSeparator = sentence.indexOf('=');
	const itemKey = sentence.slice(0, getSeparator).trim();
	const itemValue = sentence.slice(getSeparator + 1, sentence.length).trim();
	const head = itemKey.slice(0, itemKey.indexOf('.'));
	const key = itemKey.replace(head + '.', '');
	const value = itemValue.replace(/\\n/gi, '\n');
	if (!global.language[head])
		global.language[head] = {};
	global.language[head][key] = value;
}

function getText(head, key, ...args) {
	if (!global.language[head]?.[key])
		return `Can't find text: "${head}.${key}"`;
	let text = global.language[head][key];
	for (let i = args.length - 1; i >= 0; i--)
		text = text.replace(new RegExp(`%${i + 1}`, 'g'), args[i]);
	return text;
}

const defaultWriteFileSync = fs.writeFileSync;
const defaulCopyFileSync = fs.copyFileSync;

function checkAndAutoCreateFolder(pathFolder) {
	const splitPath = path.normalize(pathFolder).split(sep);
	let currentPath = '';
	for (const i in splitPath) {
		currentPath += splitPath[i] + sep;
		if (!fs.existsSync(currentPath))
			fs.mkdirSync(currentPath);
	}
}

// override fs.writeFileSync and fs.copyFileSync to auto create folder if not exist
fs.writeFileSync = function (fullPath, data) {
	fullPath = path.normalize(fullPath);
	const pathFolder = fullPath.split(sep);
	if (pathFolder.length > 1)
		pathFolder.pop();
	checkAndAutoCreateFolder(pathFolder.join(path.sep));
	defaultWriteFileSync(fullPath, data);
};

fs.copyFileSync = function (src, dest) {
	src = path.normalize(src);
	dest = path.normalize(dest);
	const pathFolder = dest.split(sep);
	if (pathFolder.length > 1)
		pathFolder.pop();
	checkAndAutoCreateFolder(pathFolder.join(path.sep));
	defaulCopyFileSync(src, dest);
};

(async () => {
	const { data: lastCommit } = await axios.get('https://api.github.com/repos/ntkhang03/Goat-Bot-V2/commits/main');
	const lastCommitDate = new Date(lastCommit.commit.committer.date);
	// if < 5min then stop update and show message
	if (new Date().getTime() - lastCommitDate.getTime() < 5 * 60 * 1000) {
		const minutes = Math.floor((5 * 60 * 1000 - (new Date().getTime() - lastCommitDate.getTime())) / 1000 / 60);
		const seconds = Math.floor((5 * 60 * 1000 - (new Date().getTime() - lastCommitDate.getTime())) / 1000 % 60);
		return log.error("ERROR", getText("updater", "updateTooFast", minutes, seconds));
	}

	const { data: versions } = await axios.get('https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/versions.json');
	const currentVersion = require('./package.json').version;
	const indexCurrentVersion = versions.findIndex(v => v.version === currentVersion);
	if (indexCurrentVersion === -1)
		return log.error("ERROR", getText("updater", "cantFindVersion", chalk.yellow(currentVersion)));
	const versionsNeedToUpdate = versions.slice(indexCurrentVersion + 1);
	if (versionsNeedToUpdate.length === 0)
		return log.info("SUCCESS", getText("updater", "latestVersion"));

	fs.writeFileSync(`${process.cwd()}/versions.json`, JSON.stringify(versions, null, 2));
	log.info("UPDATE", getText("updater", "newVersions", chalk.yellow(versionsNeedToUpdate.length)));

	const createUpdate = {
		version: "",
		files: {},
		deleteFiles: {},
		reinstallDependencies: false
	};

	for (const version of versionsNeedToUpdate) {
		for (const filePath in version.files) {
			if (["config.json", "configCommands.json"].includes(filePath)) {
				if (!createUpdate.files[filePath])
					createUpdate.files[filePath] = {};

				createUpdate.files[filePath] = {
					...createUpdate.files[filePath],
					...version.files[filePath]
				};
			}
			else
				createUpdate.files[filePath] = version.files[filePath];

			if (version.reinstallDependencies)
				createUpdate.reinstallDependencies = true;

			if (createUpdate.deleteFiles[filePath])
				delete createUpdate.deleteFiles[filePath];

			for (const filePath in version.deleteFiles)
				createUpdate.deleteFiles[filePath] = version.deleteFiles[filePath];

			createUpdate.version = version.version;
		}
	}

	const backupsPath = `${process.cwd()}/backups`;
	if (!fs.existsSync(backupsPath))
		fs.mkdirSync(backupsPath);
	const folderBackup = `${backupsPath}/backup_${currentVersion}`;

	// find all folders start with "backup_" (these folders are created by updater in old version), and move to backupsPath
	const foldersBackup = fs.readdirSync(process.cwd())
		.filter(folder => folder.startsWith("backup_") && fs.lstatSync(folder).isDirectory());
	for (const folder of foldersBackup)
		fs.moveSync(folder, `${backupsPath}/${folder}`);

	log.info("UPDATE", `Update to version ${chalk.yellow(createUpdate.version)}`);
	const { files, deleteFiles, reinstallDependencies } = createUpdate;

	for (const filePath in files) {
		const description = files[filePath];
		const fullPath = `${process.cwd()}/${filePath}`;
		let getFile;
		try {
			const response = await axios.get(`https://github.com/ntkhang03/Goat-Bot-V2/raw/main/${filePath}`, {
				responseType: 'arraybuffer'
			});
			getFile = response.data;
		}
		catch (e) {
			continue;
		}

		if (["config.json", "configCommands.json"].includes(filePath)) {
			const currentConfig = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
			const configValueUpdate = files[filePath];

			for (const key in configValueUpdate) {
				const value = configValueUpdate[key];
				if (typeof value == "string" && value.startsWith("DEFAULT_")) {
					const keyOfDefault = value.replace("DEFAULT_", "");
					_.set(currentConfig, key, _.get(currentConfig, keyOfDefault));
				}
				else
					_.set(currentConfig, key, value);
			}

			if (fs.existsSync(fullPath))
				fs.copyFileSync(fullPath, `${folderBackup}/${filePath}`);
			fs.writeFileSync(fullPath, JSON.stringify(currentConfig, null, 2));

			console.log(chalk.bold.blue('[↑]'), filePath);
			console.log(chalk.bold.yellow('[!]'), getText("updater", "configChanged", chalk.yellow(filePath)));
		}
		else {
			const contentsSkip = ["DO NOT UPDATE", "SKIP UPDATE", "DO NOT UPDATE THIS FILE"];
			const fileExists = fs.existsSync(fullPath);

			// if file exists, backup it
			if (fileExists)
				fs.copyFileSync(fullPath, `${folderBackup}/${filePath}`);

			// check first line of file, if it contains any contentsSkip, skip update this file
			const firstLine = fileExists ? fs.readFileSync(fullPath, "utf-8").trim().split(/\r?\n|\r/)[0] : "";
			const indexSkip = contentsSkip.findIndex(c => firstLine.includes(c));
			if (indexSkip !== -1) {
				console.log(chalk.bold.yellow('[!]'), getText("updater", "skipFile", chalk.yellow(filePath), chalk.yellow(contentsSkip[indexSkip])));
				continue;
			}
			else {
				fs.writeFileSync(fullPath, Buffer.from(getFile));

				if (fileExists)
					console.log(chalk.bold.blue('[↑]'), `${filePath}:`, chalk.hex('#858585')(typeof description == "string" ? description : typeof description == "object" ? JSON.stringify(description, null, 2) : description));
				else
					console.log(chalk.bold.green('[+]'), `${filePath}:`, chalk.hex('#858585')(typeof description == "string" ? description : typeof description == "object" ? JSON.stringify(description, null, 2) : description));
			}
		}
	}

	for (const filePath in deleteFiles) {
		const description = deleteFiles[filePath];
		const fullPath = `${process.cwd()}/${filePath}`;
		if (fs.existsSync(fullPath)) {
			if (fs.lstatSync(fullPath).isDirectory())
				fs.removeSync(fullPath);
			else {
				fs.copyFileSync(fullPath, `${folderBackup}/${filePath}`);
				fs.unlinkSync(fullPath);
			}
			console.log(chalk.bold.red('[-]'), `${filePath}:`, chalk.hex('#858585')(description));
		}
	}

	const { data: packageHTML } = await axios.get("https://github.com/ntkhang03/Goat-Bot-V2/blob/main/package.json");
	const json = packageHTML.split('data-target="react-app.embeddedData">')[1].split('</script>')[0];
	const packageJSON = JSON.parse(json).payload.blob.rawLines.join('\n');

	fs.writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(JSON.parse(packageJSON), null, 2));
	log.info("UPDATE", getText("updater", "updateSuccess", !reinstallDependencies ? getText("updater", "restartToApply") : ""));

	// npm install
	if (reinstallDependencies) {
		log.info("UPDATE", getText("updater", "installingPackages"));
		execSync("npm install", { stdio: 'inherit' });
		log.info("UPDATE", getText("updater", "installSuccess"));
	}

	log.info("UPDATE", getText("updater", "backupSuccess", chalk.yellow(folderBackup)));
})();