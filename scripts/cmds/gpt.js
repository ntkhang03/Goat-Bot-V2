.cmd install gpt.js const axios = require('axios');

module.exports = {
  config: {
    name: "gpt",
    version: "1.0",
    author: "YourName",
    shortDescription: "Generate text using GPT-4 API.",
    longDescription: "Generates text using GPT-4 API based on the provided prompt.",
    category: "text",
    guide: {
      en: "{pn} prompt_text"
    }
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(' ');
    if (!prompt) {
      return message.reply("Please provide a prompt for GPT generation.");
    }

    try {
      const apiUrl = `https://joshweb.click/new/gpt-4_adv?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200 && response.data && response.data.result && response.data.result.reply) {
        message.reply(response.data.result.reply);
      } else {
        message.reply("Failed to generate text. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching from GPT API:", error);
      message.reply("Failed to generate text. Please try again later.");
    }
  }
};
