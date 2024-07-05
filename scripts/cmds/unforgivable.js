const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
	config: {
		name: "unforgivable",
		aliases: ["god"],
		version: "1.0",
		author: "Samir",
		countDown: 5,
		role: 0,
		shortDescription: "Get god's notification on your searching",
		longDescription: "",
		category: "fun",
		guide: "{pn}"
	},

	onStart: async function ({ message, args }) {
		const text = args.join(" ");
		if (!text) {
			return message.reply(`Please enter a text`);
		} else {
			const img = `https://api.popcat.xyz/unforgivable?text=${encodeURIComponent(text)}`;		
      
                 const form = {
				body: ``
			};
				form.attachment = []
				form.attachment[0] = await global.utils.getStreamFromURL(img);
			message.reply(form);
			  }
}};
