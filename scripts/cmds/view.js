const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "view",
    aliases: [],
    author: "Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "View image or video from a link",
    longDescription: "View image or video from a link",
    category: "utility",
    guide: "{p}view [image/video link]",
  },

  onStart: async function ({ api, event, args, message }) {
    const link = args[0];

    if (!link) {
      return message.reply("Please provide a vaild link to view.");
    }

    try {
      const response = await axios.head(link);

     
      if (response.status === 200) {
        const contentType = response.headers['content-type'];
        let extension = '';

        if (contentType.includes('image')) {
          extension = '.png';
        } else if (contentType.includes('video')) {
          extension = '.mp4';
        } else {
          return message.reply("Unsupported link format. Please provide a valid download link.");
        }

        const tempFilePath = path.join(__dirname, "cache", `${Date.now()}${extension}`);
        const writer = fs.createWriteStream(tempFilePath);

        const downloadResponse = await axios.get(link, { responseType: "stream" });
        downloadResponse.data.pipe(writer);

        writer.on("finish", () => {
          const stream = fs.createReadStream(tempFilePath);

          message.reply({
            body: `-your request-`,
            attachment: stream,
          });
        });
      } else {
        message.reply("Unsupported link format. Please provide a valid direct download link.");
      }
    } catch (error) {
      console.error(error);
      message.reply("Sorry, an error occurred while processing your request.");
    }
  }
};
