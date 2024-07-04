const axios = require("axios");
const fs = require("fs-extra");


module.exports = {

  threadStates: {},

  config: {
    name: 'anistatus',
    aliases: ['as'],
    version: '1.0',
    author: 'HeDroxyy',
    countDown: 5,
    role: 0,
    shortDescription: 'anime status',
    longDescription: '',
    category: 'media',
    guide: {
      en: '{p}{n}',
    }
  },


  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    if (!this.threadStates[threadID]) {
      this.threadStates[threadID] = {};
    }

    try {
      api.setMessageReaction("🕐", event.messageID, (err) => {}, true);  

      const apiUrl = "https://ani-status.vercel.app/kshitiz";  
      const response = await axios.get(apiUrl);

      if (response.data.url) {
        const tikTokUrl = response.data.url;
        console.log(`TikTok Video URL: ${tikTokUrl}`);

        const lado = `https://tikdl-video.vercel.app/tiktok?url=${encodeURIComponent(tikTokUrl)}`;
        const puti = await axios.get(lado);

        if (puti.data.videoUrl) {
          const videoUrl = puti.data.videoUrl;
          console.log(`Downloadable Video URL: ${videoUrl}`);

          const cacheFilePath =  __dirname + `/cache/${Date.now()}.mp4`;
          await this.downloadVideo(videoUrl, cacheFilePath);

          if (fs.existsSync(cacheFilePath)) {
            await api.sendMessage({
              body: "Random anime status video.",
              attachment: fs.createReadStream(cacheFilePath),
            }, threadID, event.messageID);

            fs.unlinkSync(cacheFilePath);
          } else {
            api.sendMessage("Error downloading the video.", threadID);
          }
        } else {
          api.sendMessage("Error fetching video URL.", threadID);
        }
      } else {
        api.sendMessage("Error fetching data from external API.", threadID);
      }
    } catch (err) {
      console.error(err);
      api.sendMessage("An error occurred while processing the anistatus command.", threadID);
    }
  },

  downloadVideo: async function (url, cacheFilePath) {
    try {
      const response = await axios({
        method: "GET",
        url: url,
        responseType: "arraybuffer"
      });

      fs.writeFileSync(cacheFilePath, Buffer.from(response.data, "utf-8"));
    } catch (err) {
      console.error(err);
    }
  },
};
