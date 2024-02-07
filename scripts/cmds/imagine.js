const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "imagine",
    aliases: [],
    author: "kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 2,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "dalle"
    },
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: {
      en: "[prompt]"
    }
  },
  onStart: async function ({ api, event, args, message }) {
    if (args.length === 0) {
      message.reply("Please provide a prompt.");
      return;
    }

    const prompt = args.join(" ");
    message.reply("Loading image...").then((loadingMessage) => {
      axios.get(`https://kshitiz-dale.onrender.com/dalle?prompt=${prompt}`)
        .then((response) => {
          const imageUrl = response.data.imageUrl;
          const writer = fs.createWriteStream(__dirname + "/cache/image.png");
          axios.get(imageUrl, { responseType: 'stream' })
            .then((imageResponse) => {
              imageResponse.data.pipe(writer);
              writer.on('finish', () => {
                message.reply({ attachment: fs.createReadStream(__dirname + "/cache/image.png") });
                message.unsend(loadingMessage.messageID); 
              });
            })
            .catch((error) => {
              console.error("Error downloading image:", error);
              message.reply("Error downloading image.");
              message.unsend(loadingMessage.messageID); 
            });
        })
        .catch((error) => {
          console.error("Error fetching image URL:", error);
          message.reply("Error fetching image URL.");
          message.unsend(loadingMessage.messageID); 
        });
    });
  }
};
