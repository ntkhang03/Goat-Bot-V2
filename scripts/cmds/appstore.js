const itunes = require("searchitunes");
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "appstore",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Tìm app trên appstore",
		longDescription: "Tìm app trên appstore",
		category: "software",
		guide: "{pn}: {{<keyword>}}"
			+ "\n- Ví dụ:"
			+ "\n   {pn} PUBG",
		envConfig: {
			limitResult: 3
		}
	},

	onStart: async function ({ message, args, commandName, envCommands }) {
		if (!args[0])
			return message.reply("Vui lòng nhập từ khóa cần tìm");
		let results = [];
		try {
			results = (await itunes({
				entity: "software",
				country: "VN",
				term: args.join(" "),
				limit: envCommands[commandName].limitResult
			})).results;
		}
		catch (err) {
			return message.reply(`Không tìm thấy kết quả nào cho từ khóa: ${args.join(" ")}`);
		}

		if (results.length > 0) {
			let msg = "";
			const pedningImages = [];
			for (const result of results) {
				const arr = new Array(Math.round(result.averageUserRating)).fill("🌟");
				msg += `\n\n- ${result.trackCensoredName} by ${result.artistName}, ${result.formattedPrice} and rated ${arr.join('')} (${result.averageUserRating.toFixed(1)}/5)`
					+ `\n- ${result.trackViewUrl}`;
				pedningImages.push(await getStreamFromURL(result.artworkUrl512 || result.artworkUrl100 || result.artworkUrl60));
			}
			message.reply({
				body: msg,
				attachment: await Promise.all(pedningImages)
			});
		}
		else {
			message.reply(`Không tìm thấy kết quả nào cho từ khóa: ${args.join(" ")}`);
		}
	}
};