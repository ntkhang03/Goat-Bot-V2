const axios = require("axios");

module.exports = {
	config: {
		name: "leave",
		version: "1.0",
		author: "Sandy",
		countDown: 5,
		role: 2,
		shortDescription: "Bot will leave a group chat",
		longDescription: "",
		category: "admin",
		guide: {
			vi: "{pn} [tid,blank]",
			en: "{pn} [tid,blank]"
		}
	},

	onStart: async function ({ api, event, args, message }) {
		let threadID;
		if (!args.join(" ")) {
			threadID = event.threadID;
		} else {
			threadID = parseInt(args.join(" "));
		}

		try {
			await api.sendMessage("EKLOT XOLERW AAUXUH HAITA ☠️💦", threadID);
			await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
			console.log(`Left group chat: ${threadID}`);
		} catch (error) {
			console.error("Error leaving group chat:", error);
			return api.sendMessage("An error occurred while leaving the group chat.", threadID);
		}
	}
};
