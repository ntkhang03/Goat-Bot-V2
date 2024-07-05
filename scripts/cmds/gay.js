const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
	config: {
		name: "gay",
		version: "1.0",
		author: "@tas33n",
		countDown: 1,
		role: 0,
		shortDescription: "find gay",
		longDescription: "",
		category: "box chat",
		guide: "{pn} {{[on | off]}}",
		envConfig: {
			deltaNext: 5
		}
	},

	langs: {
		vi: {
			noTag: "Bạn phải tag người bạn muốn tát"
		},
		en: {
			noTag: "You must tag the person you want to "
		}
	},

	onStart: async function ({ event, message, usersData, args, getLang }) {
		let mention = Object.keys(event.mentions);
		let uid;

		if (event.type == "message_reply") {
			uid = event.messageReply.senderID;
		} else {
			if (mention[0]) {
				uid = mention[0];
			} else {
				console.log("No mention found");
				uid = event.senderID;
			}
		}

		let url = await usersData.getAvatarUrl(uid);
		let avt = await new DIG.Gay().getImage(url);
		const pathSave = `${__dirname}/tmp/gay.png`;
		fs.writeFileSync(pathSave, Buffer.from(avt));

		let body = "GAY FOUND 💀🏳️‍🌈";
		if (!mention[0]) {
			body = getLang("noTag");
		}

		message.reply({
			body: body,
			attachment: fs.createReadStream(pathSave)
		}, () => fs.unlinkSync(pathSave));
	}
};
