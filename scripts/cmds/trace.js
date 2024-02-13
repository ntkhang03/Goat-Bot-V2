const axios = require("axios");
const fs = require("fs");
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "trace",
    aliases: ['sauce'],
    version: "1.0",
    author: "JARiF",
    guide: {
      en: "collect footages by giving image. For this, simply reply to an image and type {pn}"
    },
    category:
      "collect anime footage by giving image. For this, simply reply to an image and type {pn}",
    role: 0,
  },

  onStart: async function ({ message, args, event, api }) {
    let imageUrl;

    if (event.type === "message_reply") {
      const replyAttachment = event.messageReply.attachments[0];

      if (["photo", "sticker"].includes(replyAttachment?.type)) {
        imageUrl = replyAttachment.url;
      } else {
        return api.sendMessage(
          { body: "❌ | Reply must be an image." },
          event.threadID
        );
      }
    } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
      imageUrl = args[0];
    } else {
      return api.sendMessage({ body: "❌ | Reply to an image." }, event.threadID);
    }

    const url = await tinyurl.shorten(imageUrl);
    
    const replyMessage = await message.reply("Please wait...");

    try {
      const traceResponse = await axios.get(
        `https://www.api.vyturex.com/trace?imgurl=${url}`
      );
      const firstResult = traceResponse.data.result[0];

      const fu = firstResult.filename.replace(".mp4", "");
      message.reply({
        body: `Name: ${fu}\nSimilarity: ${firstResult.similarity}`,
        attachment: await global.utils.getStreamFromURL(firstResult.video),
      });
    } catch (err) {
      message.unsend(replyMessage);
      message.reply(err.message);
      console.log(err);
    }
  },
};