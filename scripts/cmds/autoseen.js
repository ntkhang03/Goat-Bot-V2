const fs = require('fs-extra');
const pathFile = __dirname + '/cache/autoseen.txt';

module.exports = {
	config: {
	name: "autoseen",
	version: "1.0.0",
	hasPermssion: 2,
	author: "Jas",
	shortDescription: {
			en: "Turn on/off automatically seen when new messages are available"
		},
		longDescription: {
			en: "Turn on/off automatically seen when new messages are available"
		},
	category: "Admin",
	guide: {
	 en: "on/off",
},
	cooldowns: 5,
},

onChat: async ({ api, event, args }) => {
if (!fs.existsSync(pathFile))
	 fs.writeFileSync(pathFile, 'false');
	 const isEnable = fs.readFileSync(pathFile, 'utf-8');
	 if (isEnable == 'true')
		 api.markAsReadAll(() => {});
},

onStart: async ({ api, event, args }) => {
	 try {
		 if (args[0] == 'on') {
			 fs.writeFileSync(pathFile, 'true');
			 api.sendMessage('The autoseen function is now enabled for new messages.', event.threadID, event.messageID);
		 } else if (args[0] == 'off') {
			 fs.writeFileSync(pathFile, 'false');
			 api.sendMessage('The autoseen function has been disabled for new messages.', event.threadID, event.messageID);
		 } else {
			 api.sendMessage('Incorrect syntax', event.threadID, event.messageID);
		 }
	 }
	 catch(e) {
		 console.log(e);
	 }
}
};