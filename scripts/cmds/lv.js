const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  threadStates: {},

  config: {
    name: 'lv',
    version: '1.0',
    author: 'Kshitiz',
    countDown: 5,
    role: 0,
    shortDescription: 'lyrical video',
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

      const apiUrl = "https://lyricsvideo.onrender.com/kshitiz";
      const response = await axios.get(apiUrl);

      if (response.data.url) {
        const tikTokUrl = response.data.url;
        console.log(`TikTok Video URL: ${tikTokUrl}`);

        const turtleApiUrl = `https://kshitiz-tikdl.onrender.com/tiktok?url=${encodeURIComponent(tikTokUrl)}`;
        const turtleResponse = await axios.get(turtleApiUrl);

        if (turtleResponse.data.videoUrl) {
          const videoUrl = turtleResponse.data.videoUrl;
          console.log(`Downloadable Video URL: ${videoUrl}`);

          const cacheFilePath = __dirname + `/cache/tiktok_${Date.now()}.mp4`;
          await this.downloadVideo(videoUrl, cacheFilePath);

          if (fs.existsSync(cacheFilePath)) {
            await api.sendMessage({
              body: "Random lyrical video.",
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

      await api.unsendMessage(loadingMessage.messageID, threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage("An error occurred while processing the lv command.", threadID);
    }
  },

  downloadVideo: async function (url, cacheFilePath) {
    try {
      const response = await axios({
        method: "GET",
        url: url,
        responseType: "arraybuffer"
      });

      fs.writeFileSync(cacheFilePath, Buffer.from(response.data, "binary"));
    } catch (err) {
      console.error(err);
    }
  },
};
