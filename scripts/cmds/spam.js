const fs = require("fs");
module.exports = {
	config: {
		name: "spam",
		version: "1.0",
		author: "Otineeeyyyyy",
		countDown: 5,
		role: 2,
		shortDescription: "useless",
		longDescription: "",
		category: "fun",
		guide:  {
			vi: "{pn} "
		}
	},  
	onStart: async function ({ api,event,args }) {
		const axios = require("axios");
 const message = args.join(' ');
 if (!message)
return api.sendMessage(`Type the text that you want to spam.. `, event.threadID, event.messageID);
	var k = function (k) { api.sendMessage(k, event.threadID)};
for (i = 0; i < 100; i++) 
{ k(`${message}`);} 
 }
};