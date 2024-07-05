const axios = require('axios');

module.exports = {
  config: {
    name: "hentailist",
    version: "1.0",
    author: "gpt",
    role: 2,
    aliases: ["hl", "hlist"],
    category: "18+",
    description: "Shows a list of random top-rated hentai",
    guide: {
      vi: "Không có sẵn",
      en: "Usage: .hentailist"
    }
  },

  onStart: async function (context) {
    const { api, event } = context;
    const threadID = event.threadID;
    const messageID = event.messageID;

    api.setMessageReaction('💗', messageID, (err) => {
      if (err) console.error(err);
    });

    try {
      // Fetch top-rated hentai from NHentai
      const response = await axios.get('https://nhentai.net/api/galleries/search?query=popular');
      const results = response.data.result;

      // Get a random selection of 5 top-rated hentai
      const randomHentai = results.sort(() => 0.5 - Math.random()).slice(0, 5);

      if (randomHentai.length === 0) {
        api.sendMessage("No hentai found.", threadID, messageID);
        return;
      }

      let message = '🔞 Top Rated Hentai 🔞\n\n';
      randomHentai.forEach((hentai, index) => {
        message += `${index + 1}. ${hentai.title.english || hentai.title.japanese || hentai.title.pretty}\n`;
        message += `Link: https://nhentai.net/g/${hentai.id}\n\n`;
      });

      api.sendMessage(message, threadID, messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("Failed to fetch hentai list. Please try again later.", threadID, messageID);
    }
  }
};
