const axios = require("axios");

module.exports = {
  config: {
    name: "ipshow",
    version: "1.0",
    author: "Samir",
    role: 2,
    shortDescription: "Get machine IP address",
    longDescription: "Retrieves the IP address of the machine.",
    category: "utility",
    guide: {
      en: "{p}ip",
    },
  },

  onStart: async function ({ api, event }) {
    try {
      const response = await axios.get("https://api.ipify.org/?format=json");
      const ipAddress = response.data.ip;
      api.sendMessage(`Machine IP Address: ${ipAddress}`, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("Failed to retrieve IP address.", event.threadID, event.messageID);
    }
  },
};
