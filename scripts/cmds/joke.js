const axios = require('axios');

module.exports = {
	config: {
		name: "joke",
		version: "1.0",
		author: "Maher",
		countDown: 0,
		role: 2,
		shortDescription: {
			vi: "Lấy một câu chuyện cười ngẫu nhiên về châm biếm.",
			en: "Gets a random pun joke."
		},
		longDescription: {
			vi: "Lấy một câu chuyện cười ngẫu nhiên về châm biếm từ JokeAPI (https://jokeapi.dev/).",
			en: "Gets a random pun joke from JokeAPI (https://jokeapi.dev/)."
		},
		category: "fun",
		guide: "",
	},

	onStart: async function ({ message, event }) {
		try {
			const jokeResponse = await axios.get('https://v2.jokeapi.dev/joke/pun');
			const joke = jokeResponse.data;

			if (joke.type === 'single') {
				message.reply(joke.joke);
			} else if (joke.type === 'twopart') {
				message.reply(`${joke.setup}\n\n${joke.delivery}`);
			}
		} catch (error) {
			console.log(error);
			message.reply("Sorry, I couldn't think of a joke right now.");
		}
	}
};
