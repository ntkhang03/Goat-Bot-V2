const axios = require('axios');
const fs = require('fs');

module.exports = {
	config: {
		name: "sadcat",
    aliases: ["sc"],
		version: "1.1",
		author: "JV BARCENAS",
		countDown: 5,
		role: 0,
		shortDescription: "sadcat with text",
		longDescription: "sadcat with text",
		category: "image",
		guide: {
			en: "   {pn} {prompt}"
		}
	},

	onStart: async function ({ event, message, usersData, args, getLang }) {
		const userPrompt = args.join(' ');

		try {
			const response = await axios.get(`https://api.popcat.xyz/sadcat?text=${encodeURIComponent(userPrompt)}`, {
				responseType: 'arraybuffer'
			});

			const imageData = Buffer.from(response.data, 'binary');
			const pathSave = `${__dirname}/tmp/sadcat.png`;
			fs.writeFileSync(pathSave, imageData);

			message.reply({
				attachment: fs.createReadStream(pathSave)
			}, () => fs.unlinkSync(pathSave));
		} catch (error) {
			console.error(error);
			message.reply('An error occurred while generating the image.');
		}
	}
};
