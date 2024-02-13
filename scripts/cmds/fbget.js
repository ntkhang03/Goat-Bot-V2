const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "fbget",
    version: "1.0",
    author: "Zera & kshitiz",
    countDown: 5,
    role: 0,
    shortDescription: "",
    longDescription: "Download video or audio from Facebook",
    category: "media",
    guide: "{pn}fbget [audio/video link]",
  },
  onStart: async function ({ api, event, args }) {
    try {
      if (args[0] === "audio") {
        api.sendMessage(`Processing request!!`, event.threadID, (err, info) => {
          setTimeout(() => {
            api.unsendMessage(info.messageID);
          }, 100);
        }, event.messageID);

        const path = __dirname + `/cache/2.mp3`;
        let audioData = (await axios.get(event.attachments[0].playableUrl, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(path, Buffer.from(audioData, "binary"));

        return api.sendMessage(
          {
            body: `Here is your request 🎀`,
            attachment: fs.createReadStream(path),
          },
          event.threadID,
          () => fs.unlinkSync(path),
          event.messageID
        );
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage(`Unable to process the request`, event.threadID, event.messageID);
    }

    try {
      if (args[0] === "video") {
        api.sendMessage(`Processing request!!!`, event.threadID, (err, info) => {
          setTimeout(() => {
            api.unsendMessage(info.messageID);
          }, 100);
        }, event.messageID);

        const path1 = __dirname + `/cache/1.mp4`;
        let videoData = (await axios.get(event.attachments[0].playableUrl, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(path1, Buffer.from(videoData, "binary"));

        return api.sendMessage(
          {
            body: `Your Request`,
            attachment: fs.createReadStream(path1),
          },
          event.threadID,
          () => fs.unlinkSync(path1),
          event.messageID
        );
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage(`Unable to process request`, event.threadID, event.messageID);
    }
  },
};
