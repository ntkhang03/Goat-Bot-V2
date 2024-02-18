const axios = require('axios');//similar to art.js
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "animefy",
    aliases: [],
    version: "1.0",
    author: "kshitiz",
    countDown: 2,
    role: 0,
    shortDescription: "convert pic into anime style",
    longDescription: "convert pic into anime style",
    category: "anime",
    guide: "{pn} anime {on img reply}"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;


    const imageUrl = event.messageReply && event.messageReply.attachments[0].url ? event.messageReply.attachments[0].url : args.join(" ");

    try {

      const response = await axios.get(`https://animeify.shinoyama.repl.co/convert-to-anime?imageUrl=${encodeURIComponent(imageUrl)}`);
      const image = response.data.urls[1];


      const imgResponse = await axios.get(`https://www.drawever.com${image}`, { responseType: "arraybuffer" });
      const img = Buffer.from(imgResponse.data, 'binary');


      const pathie = __dirname + `/cache/animefy.jpg`;
      fs.writeFileSync(pathie, img);


      api.sendMessage({
        body: "Here's your animefied image:",
        attachment: fs.createReadStream(pathie)
      }, threadID, () => fs.unlinkSync(pathie), messageID);

    } catch (e) {
      api.sendMessage(`Error occurred:\n\n${e}`, threadID, messageID);
    }
  }
};
