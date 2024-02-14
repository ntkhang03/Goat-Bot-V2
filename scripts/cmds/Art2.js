const axios = require('axios');

module.exports = {
  config: {
    name: "art2",
    version: "1.0",
    author: "Tashrif",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: 'Prompt to Image'
    },
    longDescription: {
      en: 'Convert a prompt and image to an image'
    },
    category: "image",
    guide: {
      en: '{pn} prompt | model'
    }
  },

  onStart: async function({ api, event, args }) {
    const imageLink = event.messageReply?.attachments[0]?.url;
    const [prompt, model] = args.join(" ").split("|").map(str => str.trim());
    const defaultModel = '3';

    if (!imageLink || !prompt) {
      return api.sendMessage('Please reply to an image and provide a prompt in the format: prompt | model', event.threadID, event.messageID);
    }

    const BModel = model || defaultModel;

    const API = `https://sandipapi.onrender.com/art?imgurl=${encodeURIComponent(imageLink)}&prompt=${encodeURIComponent(prompt)}&model=${BModel}`;

    api.sendMessage("✅ Generating your image...", event.threadID, event.messageID)
      .then((info) => {
        id = info.messageID;
      });

    try {
      const imageStream = await global.utils.getStreamFromURL(API);

      return api.sendMessage({ attachment: imageStream }, event.threadID, event.messageID);
    } catch (error) {
      console.log(error);
      return api.sendMessage('Failed to generate the image.', event.threadID, event.messageID, id);
    }
  }
};
