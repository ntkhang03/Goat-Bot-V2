const axios = require("axios");
const fs = require("fs-extra");
const qs = require("qs");
const moment = require("moment-timezone");
const mimeDB = require("mime-db");
const _ = require("lodash");
const { google } = require("googleapis");
const ora = require("ora");
const chalk = require("chalk");
const log = require("./logger/log.js");

const { config } = global.GoatBot;
const { gmailAccount } = config.credentials;
const { clientId, clientSecret, refreshToken, apiKey: googleApiKey } = gmailAccount;
if (!clientId) {
	log.err("CREDENTIALS", `Please provide a valid clientId in file ${global.client.dirConfig}`);
	process.exit();
}
if (!clientSecret) {
	log.err("CREDENTIALS", `Please provide a valid clientSecret in file ${global.client.dirConfig}`);
	process.exit();
}
if (!refreshToken) {
	log.err("CREDENTIALS", `Please provide a valid refreshToken in file ${global.client.dirConfig}`);
	process.exit();
}

const oauth2ClientForGGDrive = new google.auth.OAuth2(clientId, clientSecret, "https://developers.google.com/oauthplayground");
oauth2ClientForGGDrive.setCredentials({ refresh_token: refreshToken });
const drive = google.drive({
	version: 'v3',
	auth: oauth2ClientForGGDrive
});

const word = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÈÉÊÌÍÐÒÓÔÕÙÚÝĂĐĨŨƠỨ̧̄̈ẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸabcdefghijklmnopqrstuvwxyzàáâãèéêìíðòóôõùúýăđĩũơứ̧̄̈ạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ '.split("");

function lengthWhiteSpacesEndLine(text) {
	let length = 0;
	for (let i = text.length - 1; i >= 0; i--) {
		if (text[i] == ' ')
			length++;
		else
			break;
	}
	return length;
}

function lengthWhiteSpacesStartLine(text) {
	let length = 0;
	for (let i = 0; i < text.length; i++) {
		if (text[i] == ' ')
			length++;
		else
			break;
	}
	return length;
}

function setErrorUptime() {
	global.statusAccountBot = 'block spam';
	global.responseUptimeCurrent = global.responseUptimeError;
}
const defaultStderrClearLine = process.stderr.clearLine;

const utils = {
	convertTime(miliSeconds, replaceSeconds = "giây", replaceMinutes = "phút ", replaceHours = "giờ ", replaceDays = "ngày ", replaceMonths = "tháng ", replaceYears = "năm ") {
		const second = Math.floor(miliSeconds / 1000 % 60);
		const minute = Math.floor(miliSeconds / 1000 / 60 % 60);
		const hour = Math.floor(miliSeconds / 1000 / 60 / 60 % 24);
		const day = Math.floor(miliSeconds / 1000 / 60 / 60 / 24 % 30);
		const month = Math.floor(miliSeconds / 1000 / 60 / 60 / 24 / 30 % 12);
		const year = Math.floor(miliSeconds / 1000 / 60 / 60 / 24 / 30 / 12);
		return `${year ? year + replaceYears : ''}${month ? month + replaceMonths : year ? "00" + replaceMonths : ''}${day ? day + replaceDays : month ? "00" + replaceDays : year ? "00" + replaceDays : ''}${hour ? hour + replaceHours : day ? "00" + replaceHours : month ? "00" + replaceHours : year ? "00" + replaceHours : ''}${minute ? minute + replaceMinutes : hour ? "00" + replaceMinutes : day ? "00" + replaceMinutes : month ? "00" + replaceMinutes : year ? "00" + replaceMinutes : ''}${second}${replaceSeconds}`;
		// Do you have a shorter way? Copilot suggested the above code for me X_X
		// return `${hour ? `${hour} giờ ` : ""}${minute ? `${minute} phút ` : ""}${second} giây`;
	},
	createOraDots(text) {
		const spin = new ora({
			text: text,
			spinner: {
				interval: 80,
				frames: [
					'⠋', '⠙', '⠹',
					'⠸', '⠼', '⠴',
					'⠦', '⠧', '⠇',
					'⠏'
				]
			}
		});
		spin._start = () => {
			utils.enableStderrClearLine(false);
			spin.start();
		};
		spin._stop = () => {
			utils.enableStderrClearLine(true);
			spin.stop();
		};
		return spin;
	},
	defaultStderrClearLine,
	enableStderrClearLine: (isEnable = true) => process.stderr.clearLine = isEnable ? defaultStderrClearLine : () => { },
	getExtFromAttachmentType(type) {
		switch (type) {
			case "photo":
				return 'png';
			case "animated_image":
				return "gif";
			case "video":
				return "mp4";
			case "audio":
				return "mp3";
			default:
				return "txt";
		}
	},
	getExtFromMimeType(mimeType = "") {
		return mimeDB[mimeType] ? (mimeDB[mimeType].extensions || [])[0] || "unknow" : "unknow";
	},
	getExtFromUrl(url = "") {
		if (!url || typeof url !== "string")
			throw new Error('The first argument (url) must be a string');
		const reg = /(?<=https:\/\/cdn.fbsbx.com\/v\/.*?\/|https:\/\/video.xx.fbcdn.net\/v\/.*?\/|https:\/\/scontent.xx.fbcdn.net\/v\/.*?\/).*?(\/|\?)/g;
		const fileName = url.match(reg)[0].slice(0, -1);
		return fileName.slice(fileName.lastIndexOf(".") + 1);
	},
	getPrefix(threadID) {
		if (!threadID || isNaN(threadID))
			throw new Error('The first argument (threadID) must be a number');
		threadID = String(threadID);
		let prefix = global.GoatBot.config.prefix;
		const threadData = global.db.allThreadData.find(t => t.threadID == threadID);
		threadData ? prefix = threadData.data.prefix || prefix : "";
		return prefix;
	},
	getTime(timestamps, format) {
		if (!format && typeof timestamps == 'string') {
			format = timestamps;
			timestamps = undefined;
		}
		return moment(timestamps).tz(config.timeZone).format(format);
	},
	jsonStringifyColor(obj, filter, indent, level) {
		// source: https://www.npmjs.com/package/node-json-color-stringify
		indent = indent || 0;
		level = level || 0;
		let output = '';

		if (typeof obj === 'string')
			output += chalk`{green "}{green ${obj}}{green "}`;
		else if (typeof obj === 'number' || typeof obj === 'boolean' || obj === null)
			output += chalk`{yellow ${obj}}`;
		else if (obj === undefined)
			output += chalk`{gray undefined}`;
		else if (obj !== undefined && typeof obj !== 'function')
			if (obj.length === undefined) {
				if (Object.keys(obj).length === 0)
					output += '{}';
				else {
					output += chalk`{grey {\n}`;
					Object.keys(obj).forEach(key => {
						let value = obj[key];

						if (filter) {
							if (typeof filter === 'function')
								value = filter(key, value);
							else if (typeof filter === 'object' && filter.length !== undefined)
								if (filter.indexOf(key) < 0)
									return;
						}

						// if (value === undefined)
						// 	return;
						if (!isNaN(key[0]) || key.match(/[^a-zA-Z0-9_]/))
							key = chalk`{green ${JSON.stringify(key)}}`;

						output += ' '.repeat(indent + level * indent) + `${key}:${indent ? ' ' : ''}`;
						output += utils.jsonStringifyColor(value, filter, indent, level + 1) + ',\n';
					});

					output = output.replace(/,\n$/, '\n');
					output += ' '.repeat(level * indent) + chalk`{grey ${'}'}}`;
				}
			}
			else {
				if (obj.length === 0)
					output += '[]';
				else {
					output += chalk`{grey [\n}`;
					obj.forEach(subObj => {
						output += ' '.repeat(indent + level * indent) + utils.jsonStringifyColor(subObj, filter, indent, level + 1) + ',\n';
					});

					output = output.replace(/,\n$/, '\n');
					output += ' '.repeat(level * indent) + chalk`{grey ]}`;
				}
			}
		else if (typeof obj === 'function')
			output += chalk`{green ${obj.toString()}}`;

		output = output.replace(/,$/gm, chalk`{grey ,}`);
		if (indent === 0)
			return output.replace(/\n/g, '');

		return output;
	},
	loading: require("./logger/loading.js"),
	log,
	logColor: require("./logger/logColor.js"),
	message(api, event) {
		async function sendMessageError(err) {
			if (typeof err === "object" && !err.stack)
				err = utils.removeHomeDir(JSON.stringify(err, null, 2));
			else
				err = utils.removeHomeDir(`${err.name || err.error}: ${err.message}`);
			return await api.sendMessage(utils.getLang("utils", "errorOccurred", err, event.threadID, event.messageID));
		}
		return {
			send: async (form, callback) => {
				try {
					global.statusAccountBot = 'good';
					return await api.sendMessage(form, event.threadID, callback);
				}
				catch (err) {
					if (JSON.stringify(err).includes('spam')) {
						setErrorUptime();
						throw err;
					}
				}
			},
			reply: async (form, callback) => {
				try {
					global.statusAccountBot = 'good';
					return await api.sendMessage(form, event.threadID, callback, event.messageID);
				}
				catch (err) {
					if (JSON.stringify(err).includes('spam')) {
						setErrorUptime();
						throw err;
					}
				}
			},
			unsend: async (messageID, callback) => await api.unsendMessage(messageID, callback),
			reaction: async (emoji, messageID, callback) => {
				try {
					global.statusAccountBot = 'good';
					return await api.setMessageReaction(emoji, messageID, callback, true);
				}
				catch (err) {
					if (JSON.stringify(err).includes('spam')) {
						setErrorUptime();
						throw err;
					}
				}
			},
			err: async (err) => await sendMessageError(err),
			error: async (err) => await sendMessageError(err)
		};
	},
	randomString(max) {
		if (!max || isNaN(max))
			max = 10;
		let text = "";
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (let i = 0; i < max; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	},
	randomNumber(min, max) {
		if (!max) {
			max = min;
			min = 0;
		}
		if (min == null || min == undefined || isNaN(min))
			throw new Error('The first argument (min) must be a number');
		if (max == null || max == undefined || isNaN(max))
			throw new Error('The second argument (max) must be a number');
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	removeHomeDir(fullPath) {
		if (!fullPath || typeof fullPath !== "string")
			throw new Error('The first argument (fullPath) must be a string');
		while (fullPath.includes(process.cwd()))
			fullPath = fullPath.replace(process.cwd(), "");
		return fullPath;
	},
	splitPage(arr, limit) {
		const allPage = _.chunk(arr, limit);
		return {
			totalPage: allPage.length,
			allPage
		};
	},
	translateAPI(text, lang) {
		return new Promise((resolve, reject) => {
			axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`)
				.then(res => {
					resolve(res.data[0][0][0]);
				})
				.catch(err => {
					reject(err);
				});
		});
	},

	async downloadFile(url = "", path = "") {
		if (!url || typeof url !== "string")
			throw new Error(`The first argument (url) must be a string`);
		if (!path || typeof path !== "string")
			throw new Error(`The second argument (path) must be a string`);
		const getFile = await axios.get(url, {
			responseType: "arraybuffer"
		});
		fs.writeFileSync(path, Buffer.from(getFile.data));
		return path;
	},
	async findUid(link) {
		const response = await axios.post("https://id.traodoisub.com/api.php", qs.stringify({ link }));
		const uid = response.data.id;
		if (!uid) {
			const err = new Error(response.data.error);
			for (const key in response.data)
				err[key] = response.data[key];
			throw err;
		}
		return uid;
	},
	async getStreamsFromAttachment(attachments) {
		const streams = [];
		for (const attachment of attachments) {
			const url = attachment.url;
			const ext = utils.getExtFromUrl(url);
			const fileName = utils.randomString(10) + ext;
			streams.push({
				pending: axios({
					url,
					method: "GET",
					responseType: "stream"
				}),
				fileName
			});
		}
		for (let i = 0; i < streams.length; i++) {
			const stream = await streams[i].pending;
			stream.data.path = streams[i].fileName;
			streams[i] = stream.data;
		}
		return streams;
	},
	async getStreamFromURL(url = "", pathName = "", options = {}) {
		if (!options && typeof pathName === "object") {
			options = pathName;
			pathName = "";
		}
		try {
			if (!url || typeof url !== "string")
				throw new Error(`The first argument (url) must be a string`);
			const response = await axios({
				url,
				method: "GET",
				responseType: "stream",
				...options
			});
			if (!pathName)
				pathName = utils.randomString(10) + (response.headers["content-type"] ? '.' + utils.getExtFromMimeType(response.headers["content-type"]) : ".noext");
			response.data.path = pathName;
			return response.data;
		}
		catch (err) {
			throw err;
		}
	},
	async translate(text, lang) {
		if (typeof text !== "string")
			throw new Error(`The first argument (text) must be a string`);
		if (!lang)
			lang = 'en';
		if (typeof lang !== "string")
			throw new Error(`The second argument (lang) must be a string`);
		const wordTranslate = [''];
		const wordNoTranslate = [''];
		const wordTransAfter = [];
		let lastPosition = 'wordTranslate';

		if (word.indexOf(text.charAt(0)) == -1)
			wordTranslate.push('');
		else
			wordNoTranslate.splice(0, 1);

		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			if (word.indexOf(char) !== -1) { // is word
				const lengWordNoTranslate = wordNoTranslate.length - 1;
				if (wordNoTranslate[lengWordNoTranslate] && wordNoTranslate[lengWordNoTranslate].includes('{') && !wordNoTranslate[lengWordNoTranslate].includes('}')) {
					wordNoTranslate[lengWordNoTranslate] += char;
					continue;
				}
				const lengWordTranslate = wordTranslate.length - 1;
				if (lastPosition == 'wordTranslate') {
					wordTranslate[lengWordTranslate] += char;
				}
				else {
					wordTranslate.push(char);
					lastPosition = 'wordTranslate';
				}
			}
			else { // is no word
				const lengWordNoTranslate = wordNoTranslate.length - 1;
				const twoWordLast = wordNoTranslate[lengWordNoTranslate]?.slice(-2) || '';
				if (lastPosition == 'wordNoTranslate') {
					if (twoWordLast == '}}') {
						wordTranslate.push("");
						wordNoTranslate.push(char);
					}
					else
						wordNoTranslate[lengWordNoTranslate] += char;
				}
				else {
					wordNoTranslate.push(char);
					lastPosition = 'wordNoTranslate';
				}
			}
		}

		for (let i = 0; i < wordTranslate.length; i++) {
			const text = wordTranslate[i];
			if (!text.match(/[^\s]+/))
				wordTransAfter.push(text);
			else
				wordTransAfter.push(utils.translateAPI(text, lang));
		}

		let output = '';

		for (let i = 0; i < wordTransAfter.length; i++) {
			let wordTrans = (await wordTransAfter[i]);
			if (wordTrans.trim().length === 0) {
				output += wordTrans;
				if (wordNoTranslate[i] != undefined)
					output += wordNoTranslate[i];
				continue;
			}

			wordTrans = wordTrans.trim();
			const numberStartSpace = lengthWhiteSpacesStartLine(wordTranslate[i]);
			const numberEndSpace = lengthWhiteSpacesEndLine(wordTranslate[i]);

			wordTrans = ' '.repeat(numberStartSpace) + wordTrans.trim() + ' '.repeat(numberEndSpace);

			output += wordTrans;
			if (wordNoTranslate[i] != undefined)
				output += wordNoTranslate[i];
		}
		return output;
	},
	drive: {
		default: drive,
		parentID: "",
		async uploadFile(fileName, mimeType, file) {
			if (!file && typeof fileName === "string") {
				file = mimeType;
				mimeType = undefined;
			}
			let response;
			try {
				response = (await drive.files.create({
					resource: {
						name: fileName,
						parents: [this.parentID]
					},
					media: {
						mimeType,
						body: file
					},
					fields: "*"
				})).data;
			}
			catch (err) {
				throw new Error(err.errors.map(e => e.message).join("\n"));
			}
			await utils.drive.makePublic(response.id);
			return response;
		},

		async deleteFile(id) {
			if (!id || typeof id !== "string")
				throw new Error('The first argument (id) must be a string');
			try {
				await drive.files.delete({
					fileId: id
				});
				return true;
			}
			catch (err) {
				throw new Error(err.errors.map(e => e.message).join("\n"));
			}
		},

		getUrlDownload(id = "") {
			if (!id || typeof id !== "string")
				throw new Error('The first argument (id) must be a string');
			return `https://docs.google.com/uc?id=${id}&export=download&confirm=t${googleApiKey ? `&key=${googleApiKey}` : ''}`;
		},

		async getFile(id, responseType) {
			if (!id || typeof id !== "string")
				throw new Error('The first argument (id) must be a string');
			if (!responseType)
				responseType = "arraybuffer";
			if (typeof responseType !== "string")
				throw new Error('The second argument (responseType) must be a string');

			const response = await drive.files.get({
				fileId: id,
				alt: 'media'
			}, {
				responseType
			});
			const headersResponse = response.headers;
			const file = response.data;

			const fileName = headersResponse["content-disposition"]?.split('filename="')[1]?.split('"')[0] || `${utils.randomString(10)}.${utils.getExtFromMimeType(headersResponse["content-type"])}`;

			if (responseType === "stream")
				file.path = fileName;

			return file;
		},

		async getFileName(id) {
			if (!id || typeof id !== "string")
				throw new Error('The first argument (id) must be a string');
			const { fileNames: tempFileNames } = global.temp.filesOfGoogleDrive;
			if (tempFileNames[id])
				return tempFileNames[id];
			try {
				const { data: response } = await drive.files.get({
					fileId: id,
					fields: "name"
				});
				tempFileNames[id] = response.name;
				return response.name;
			}
			catch (err) {
				throw new Error(err.errors.map(e => e.message).join("\n"));
			}
		},

		async makePublic(id) {
			if (!id || typeof id !== "string")
				throw new Error('The first argument (id) must be a string');
			try {
				await drive.permissions.create({
					fileId: id,
					requestBody: {
						role: 'reader',
						type: 'anyone'
					}
				});
				return id;
			}
			catch (err) {
				const error = new Error(err.errors.map(e => e.message).join("\n"));
				error.name = 'CAN\'T_MAKE_PUBLIC';
				throw new Error(err.errors.map(e => e.message).join("\n"));
			}
		},

		async checkAndCreateParentFolder(folderName) {
			if (!folderName || typeof folderName !== "string")
				throw new Error('The first argument (folderName) must be a string');
			let parentID;
			const { data: findParentFolder } = await drive.files.list({
				q: `name="${folderName}" and mimeType="application/vnd.google-apps.folder" and trashed=false`,
				fields: '*'
			});
			const parentFolder = findParentFolder.files.find(i => i.ownedByMe);
			if (!parentFolder) {
				const { data } = await drive.files.create({
					requestBody: {
						name: folderName,
						mimeType: 'application/vnd.google-apps.folder'
					}
				});
				await drive.permissions.create({
					fileId: data.id,
					requestBody: {
						role: 'reader',
						type: 'anyone'
					}
				});
				parentID = data.id;
			}
			else if (!parentFolder.shared) {
				await drive.permissions.create({
					fileId: parentFolder.id,
					requestBody: {
						role: 'reader',
						type: 'anyone'
					}
				});
				parentID = parentFolder.data.id;
			}
			else
				parentID = parentFolder.id;
			return parentID;
		}
	}
};

module.exports = utils;
