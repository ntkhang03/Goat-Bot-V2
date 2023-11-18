const fs = require("fs-extra");
const log = require("../logger/log.js");
const path = require("path");

let pathLanguageFile = `${__dirname}/${global.GoatBot.config.language}.lang`;
if (!fs.existsSync(pathLanguageFile)) {
	log.warn("LANGUAGE", `Can't find language file ${global.GoatBot.config.language}.lang, using default language file "${__dirname}/en.lang"`);
	pathLanguageFile = `${__dirname}/en.lang`;
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
		let pathLanguageFile = path.normalize(`${__dirname}/${head.lang}.lang`);
		head = head.head;
		if (!fs.existsSync(pathLanguageFile)) {
			log.warn("LANGUAGE", `Can't find language file ${pathLanguageFile}, using default language file "${path.normalize(`${__dirname}/en.lang`)}"`);
			pathLanguageFile = `${__dirname}/en.lang`;
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

module.exports = getText;