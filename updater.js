const axios = require('axios');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');
const log = require('./logger/log.js');
let chalk;
try {
	chalk = require("./func/colors.js").colors;
}
catch (e) {
	chalk = require("chalk");
}
const langCode = require('./config.json').language;
const execSync = require('child_process').execSync;

let pathLanguageFile = `${process.cwd()}/languages/${langCode}.lang`;
if (!fs.existsSync(pathLanguageFile)) {
	log.warn("LANGUAGE", `Can't find language file ${langCode}.lang, using default language file "${process.cwd()}/languages/en.lang"`);
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
	const splitPath = path.normalize(pathFolder).replace(/\\/g, '/').split('/');
	let currentPath = '';
	for (const i in splitPath) {
		currentPath += splitPath[i] + '/';
		if (!fs.existsSync(currentPath))
			fs.mkdirSync(currentPath);
	}
}

fs.writeFileSync = function (fullPath, data) {
	fullPath = path.normalize(fullPath).replace(/\\/g, '/');
	const pathFolder = fullPath.split('/');
	if (pathFolder.length > 1)
		pathFolder.pop();
	checkAndAutoCreateFolder(pathFolder.join('/'));
	defaultWriteFileSync(fullPath, data);
};

fs.copyFileSync = function (src, dest) {
	src = path.normalize(src);
	dest = path.normalize(dest).replace(/\\/g, '/');
	const pathFolder = dest.split('/');
	if (pathFolder.length > 1)
		pathFolder.pop();
	checkAndAutoCreateFolder(pathFolder.join('/'));
	defaulCopyFileSync(src, dest);
};

(async () => {
	const { data: versions } = await axios.get('https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/versions.json');
	const currentVersion = require('./package.json').version;
	const versionsNeedToUpdate = versions.slice(versions.findIndex(v => v.version === currentVersion) + 1);
	if (versionsNeedToUpdate.length === 0)
		return log.info("SUCCESS", getText("updater", "latestVersion"));

	let folderBackup = `${process.cwd()}/backup_${currentVersion}`;

	fs.writeFileSync(`${process.cwd()}/versions.json`, JSON.stringify(versions, null, 2));
	log.info("UPDATE", getText("updater", "newVersions", chalk.yellow(versionsNeedToUpdate.length)));

	let isReinstallDependencies = false;

	for (const version of versionsNeedToUpdate) {
		log.info("UPDATE", `Update version ${version.version}`);
		const { files, deleteFiles, reinstallDependencies } = version;
		if (reinstallDependencies)
			isReinstallDependencies = true;

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

			if (filePath === "config.json") {
				const currentConfig = require('./config.json');
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

				fs.writeFileSync(fullPath, JSON.stringify(currentConfig, null, 2));
				console.log(chalk.bold.blue('[↑]'), `${filePath}`);
				// warning config.json is changed
				console.log(chalk.bold.yellow('[!]'), getText("updater", "configChanged"));
			}

			if (fs.existsSync(fullPath))
				fs.copyFileSync(fullPath, `${folderBackup}/${filePath}`);
			if (filePath != "config.json")
				fs.writeFileSync(fullPath, Buffer.from(getFile));

			console.log(chalk.bold.blue('[↑]'), `${filePath}:`, chalk.hex('#858585')(description));
		}

		for (const filePath in deleteFiles) {
			const description = deleteFiles[filePath];
			const fullPath = `${process.cwd()}/${filePath}`;
			if (fs.existsSync(fullPath)) {
				if (fs.lstatSync(fullPath).isDirectory())
					fs.removeSync(fullPath);
				else
					fs.unlinkSync(fullPath);
				console.log(chalk.bold.red('[-]'), `${filePath}:`, chalk.hex('#858585')(description));
			}
		}

		log.info("UPDATE", getText("updater", "backupSuccess", chalk.yellow(folderBackup)));
		folderBackup = `${process.cwd()}/backup_${version.version}`;
	}

	// fixes package.json not updating content by itself
	const { data: packageHTML5 } = await axios.get("https://github.com/ntkhang03/Goat-Bot-V2/blob/main/package.json");
	const $ = cheerio.load(packageHTML5);
	const content = $('td.blob-code-inner').text();
	fs.writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(JSON.parse(content), null, 2));
	log.info("UPDATE", getText("updater", "updateSuccess", !isReinstallDependencies ? getText("updater", "restartToApply") : ""));

	// npm install
	if (isReinstallDependencies) {
		log.info("UPDATE", getText("updater", "installingPackages"));
		execSync("npm install", { stdio: 'inherit' });
		log.info("UPDATE", getText("updater", "installSuccess"));
	}

})();