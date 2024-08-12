.cmd install quote.js const axios = require('axios');

module.exports = {
  config: {
    name: "quote",
    version: "1.0",
    author: "YourName",
    shortDescription: "Fetch a random quote.",
    longDescription: "Fetches a random quote from an API.",
    category: "text",
    guide: {
      en: "{pn} quote"
    }
  },

  onStart: async function ({ message }) {
    try {
      const apiUrl = 'https://joshweb.click/quotes';
      const response = await axios.get(apiUrl);

      if (response.status === 200 && response.data && response.data.quotes && response.data.author) {
        const { quotes, author } = response.data;
        message.reply(`"${quotes}" - ${author}`);
      } else {
        message.reply("Failed to fetch a quote. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      message.reply("Failed to fetch a quote. Please try again later.");
    }
  }
};
