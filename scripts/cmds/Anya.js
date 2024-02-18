const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "anya",
    aliases: [],
    author: "aminulsordar",
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "japnese anya text to speech"
    },
    category: "𝗔𝗜",
    guide: {
      en: "{p}{n} japn [text]"
    }
  },
  onStart: async function ({ api, event, args }) {
    try {
      const {
        createReadStream,
        unlinkSync
      } = fs;

      const {
        resolve
      } = path;

      const {
        messageID,
        threadID,
        senderID
      } = event;

      const name = "Anya"; 

      const ranGreetVar = [`Konichiwa ${name}`, "Konichiwa senpai", "Hora"];
      const ranGreet = ranGreetVar[Math.floor(Math.random() * ranGreetVar.length)];

      const chat = args.join(" ");

      if (!args[0]) return api.sendMessage(`${ranGreet}`, threadID, messageID);

      const simRes = ` ${chat}`;


      const text = encodeURIComponent(simRes);

      const audioPath = resolve(__dirname, 'cache', `${threadID}_${senderID}.wav`);

      const audioApi = await axios.get(`https://api.tts.quest/v3/voicevox/synthesis?text=${text}&speaker=3`);

      const audioUrl = audioApi.data.mp3StreamingUrl;

      await global.utils.downloadFile(audioUrl, audioPath);

      const att = createReadStream(audioPath);

      api.sendMessage({
        body: simRes,
        attachment: att
      }, threadID, () => unlinkSync(audioPath));
    } catch (error) {
      console.error(error);
      api.sendMessage("error", threadID, messageID);
    }
  }
};
