const fs = require("fs");
const path = require("path");
const axios = require("axios");
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "render",
    aliases: [],
    version: "1.0",
    author: "Kshitiz",
    countDown: 20,
    role: 0,
    shortDescription: "lado puti",
    longDescription: " generate 3d type image & support image to image",
    category: "fun",
    guide: {
      en: "{p}render reply to image or {p}render [prompt]"
    }
  },
  onStart: async function ({ message, event, args, api }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);

    try {
      const promptApiUrl = "https://www.api.vyturex.com/describe?url=";
      const renderApiUrl = "https://ai-tools.replit.app/render?prompt=";

      let prompt = '';

      if (event.type === "message_reply") {
        const attachment = event.messageReply.attachments[0];
        if (!attachment || !["photo", "sticker"].includes(attachment.type)) {
          return message.reply("❌ | Reply must be an image.");
        }
        const imageUrl = await tinyurl.shorten(attachment.url);
        const promptResponse = await axios.get(promptApiUrl + encodeURIComponent(imageUrl));
        prompt = encodeURIComponent(promptResponse.data);
      } else {
        prompt = encodeURIComponent(args.join(" "));
      }

      const renderResponse = await axios.get(renderApiUrl + prompt, {
        responseType: "arraybuffer"
      });

      const cacheFolderPath = path.join(__dirname, "/cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(renderResponse.data, "binary"));

      const stream = fs.createReadStream(imagePath);
      message.reply({
        body: "",
        attachment: stream
      });

    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | An error occurred. Please try again later.");
    }
  }
};
