const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "anipic",
    aliases: [],
    author: "kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "get a random anime picture"
    },
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: {
      en: ""
    }
  },
  onStart: async function ({ api, event }) {
    let path = __dirname + "/cache/anipic_image.png";

    let tid = event.threadID;
    let mid = event.messageID;

    try {
      let response = await axios.get("https://pic.re/image", { responseType: "stream" });

      if (response.data) {
        let imageResponse = response.data;
        imageResponse.pipe(fs.createWriteStream(path));

        imageResponse.on("end", () => {
          api.sendMessage({ attachment: fs.createReadStream(path) }, tid, () => fs.unlinkSync(path), mid);
        });
      } else {
        return api.sendMessage("Failed to fetch random anime picture. Please try again.", tid, mid);
      }
    } catch (e) {
      return api.sendMessage(e.message, tid, mid);
    }
  }
};
