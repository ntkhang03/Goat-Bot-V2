const axios = require("axios");

let deltaNext;
const expToLevel = exp => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
const levelToExp = level => Math.floor(((Math.pow(level, 2) - level) * deltaNext) / 2);

module.exports = {
	config: {
		name: "rank",
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Xem level của người dùng",
			en: "View level of user"
		},
		longDescription: {
			vi: "Xem level của bạn hoặc người được tag. Có thể tag nhiều người",
			en: "View your level or the level of the tagged person. You can tag many people"
		},
		category: "rank",
		guide: "{pn} [để trống | @tags]",
		envConfig: {
			deltaNext: 5
		}
	},

	onStart: async function ({ message, event, usersData, threadsData, commandName, envCommands }) {
		deltaNext = envCommands[commandName].deltaNext;
		let targetUsers;
		const arrayMentions = Object.keys(event.mentions);

		if (arrayMentions.length == 0)
			targetUsers = [event.senderID];
		else
			targetUsers = arrayMentions;

		for (const userID of targetUsers) {
			const { exp } = await usersData.get(userID);
			const levelUser = expToLevel(exp);

			const expNextLevel = levelToExp(levelUser + 1) - levelToExp(levelUser);
			const currentExp = expNextLevel - (levelToExp(levelUser + 1) - exp);

			const allUser = usersData.getAll();
			allUser.sort((a, b) => b.exp - a.exp);
			const rank = allUser.findIndex(user => user.userID == userID) + 1;

			const defaultDesignCard = {
				widthCard: 2000,
				heightCard: 500,
				main_color: "#474747",
				sub_color: "rgba(255, 255, 255, 0.5)",
				alpha_subcard: 0.9,
				exp_color: "#e1e1e1",
				expNextLevel_color: "#3f3f3f",
				text_color: "#000000"
			};

			const customRankCard = await threadsData.get(event.threadID, "data.customRankCard") || {};
			const dataLevel = {
				exp: currentExp,
				expNextLevel,
				name: allUser[rank - 1].name,
				rank: `#${rank}/${allUser.length}`,
				level: levelUser,
				avatar: await usersData.getAvatarUrl(userID)
			};

			try {
				const { data: image } = await axios.get("https://goatbot.up.railway.app/taoanhdep/makerankcard", {
					params: {
						...defaultDesignCard,
						...customRankCard,
						...dataLevel
					},
					responseType: "stream"
				});
				image.path = `rankcard_${userID}.png`;
				message.reply({
					attachment: image
				});
			}
			catch (err) {
				return message.err(err.message);
			}
		}
	},

	onChat: async function ({ usersData, event }) {
		let { exp } = await usersData.get(event.senderID);
		if (isNaN(exp))
			exp = 0;
		try {
			await usersData.set(event.senderID, {
				exp: exp + 1
			});
		}
		catch (e) { }
	}
};