const axios = require("axios");

module.exports = {
  config: {
    name: "liner",
    version: 1.0,
    author: "kshitiz",
    description: "liner ai",
    category: '𝗜𝗡𝗙𝗢',
    guide: {
      en: "{p}{n} <Query>"
    }
  },

  onStart: async function ({ message, usersData, event, api, args }) {
    try {
      const senderID = event.senderID;
      const userData = await usersData.get(senderID);
      const senderName = userData.name;
      const mentions = [{ id: senderID, tag: senderName }];
      const query = args.join(" ");
      const encodedQuery = encodeURIComponent(query);

      api.setMessageReaction('🥱', event.messageID, () => {}, true);

      const response = await axios.get("https://api.vyturex.com/liner?prompt=" + encodedQuery);
      const result = response.data.answer;

      api.setMessageReaction('✔', event.messageID, () => {}, true);

      message.reply({
        body: `${senderName} ${result}`,
        mentions: mentions
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
