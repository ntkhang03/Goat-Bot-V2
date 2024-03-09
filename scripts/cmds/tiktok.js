const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "tiktok",
    author: "Kshitiz",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Search for TikTok videos",
    longDescription: "Search for TikTok videos using keywords",
    category: "media",
    guide: "{p}tiktok keyword",
  },

  onStart: async function ({ api, event, args, message }) {
    api.setMessageReaction("🕐", event.messageID, () => {}, true);

    try {
      const query = args.join(" ");
      const response = await axios.get(`https://api.betabotz.eu.org/api/search/tiktoks?query=${query}&apikey=vrGjIdJL`);

      if (response.data.status && response.data.result.data.length > 0) {
        const videoUrl = response.data.result.data[0].play;
        const videoFileName = `${response.data.result.data[0].video_id}.mp4`;

      
        const tempVideoPath = path.join(__dirname, "cache", videoFileName);
        const writer = fs.createWriteStream(tempVideoPath);

        const videoResponse = await axios.get(videoUrl, { responseType: "stream" });
        videoResponse.data.pipe(writer);

        writer.on("finish", () => {
         
          const videoStream = fs.createReadStream(tempVideoPath);
          message.reply({ attachment: videoStream });
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        });
      } else {
        message.reply("No TikTok videos found for the given query.");
        api.setMessageReaction("❌", event.messageID, () => {}, true);
      }
    } catch (error) {
      console.error(error);
      message.reply("Sorry, an error occurred while processing your request.");
    }
  }
};
