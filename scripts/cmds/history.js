const axios = require('axios');

module.exports = {
  config: {
    name: "history",
    aliases: [],
    version: "1.0",
    author: "kshitiz",
    countDown: 10,
    role: 0,
    shortDescription: "search and know about history",
    longDescription: "send information about historical events.",
    category: "𝗜𝗡𝗙𝗢",
    guide: "{p}history search_query",
  },

  onStart: async function ({ api, args, event }) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      api.sendMessage("Please provide a search query (e.g., history anglo Nepal war).", event.threadID);
      return;
    }

    try {
      const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`);

      if (response.data.title && response.data.extract) {
        const title = response.data.title;
        const extract = response.data.extract;


        api.sendMessage(`Information about "${title}":\n${extract}`, event.threadID, event.messageID);
      } else {
        api.sendMessage(`No information found for "${searchQuery}".`, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("Error fetching historical information:", error);
      api.sendMessage("An error occurred while fetching historical information.", event.threadID, event.messageID);
    }
  }
};
