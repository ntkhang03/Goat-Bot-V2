const axios = require('axios');

module.exports = {
  config: {
    name: "prompt",
    version: "1.0",
    author: "JARiF",
    countDown: 5,
    role: 0,
    longDescription: {
      vi: "",
      en: "Get midjourney prompts."
    },
    category: "AI"
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      const khankirChele = args.join(" ");
      let imageUrl;

      if (event.type === "message_reply") {
        if (["photo", "sticker"].includes(event.messageReply.attachments[0]?.type)) {
          imageUrl = event.messageReply.attachments[0].url;
        } else {
          return api.sendMessage({ body: "❌ | Reply must be an image." }, event.threadID);
        }
      } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
        imageUrl = args[0];
      } else if (!khankirChele) {
        return api.sendMessage({ body: "❌ | Reply to an image or provide a prompt." }, event.threadID);
      }

      if (imageUrl) {
        const response = await axios.get(`https://www.api.vyturex.com/describe?url=${encodeURIComponent(imageUrl)}`);
        const description = response.data;

        await message.reply(description);
      } else if (khankirChele) {
        const response = await axios.get(`https://www.api.vyturex.com/promptgen?content=${encodeURIComponent(khankirChele)}`);
        const prompt = response.data;

        await message.reply(prompt);
      }
    } catch (error) {
     message.reply(`${error}`);
    }
  }
};
