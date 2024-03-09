const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  threadStates: {},
  config: {
    name: 'terabox',
    version: '1.0',
    author: 'Kshitiz',
    countDown: 5,
    role: 0,
    shortDescription: 'terabox Auto video downloader ',
    longDescription: '',
    category: 'media',
    guide: {
      en: '{p}{n}',
    }
  },
  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    this.threadStates[threadID] = false;

    if (event.body.toLowerCase().includes('terabox on')) {
      this.threadStates[threadID] = true;
      api.sendMessage("Terabox is now active.", event.threadID, event.messageID);
    } else if (event.body.toLowerCase().includes('terabox off')) {
      this.threadStates[threadID] = false;
      api.sendMessage("Terabox is now inactive.", event.threadID, event.messageID);
    }
  },
  onChat: async function ({ api, event }) {
    const threadID = event.threadID;
    if (this.threadStates[threadID] && event.body.includes('https://teraboxapp.com/s/')) {
      const url = event.body.trim();
      console.log(`Terabox link detected: ${url}`);
      this.downLoad(url, api, event);
      api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    }
  },
  downLoad: async function (url, api, event) {
    try {
      console.log(`Attempting to download from URL: ${url}`);
      const res = await axios.get(`https://tera-box.onrender.com/kshitiz?link=${encodeURIComponent(url)}`);
      console.log(`Terabox API response: ${JSON.stringify(res.data)}`);
      const downloadLink = res.data.downloadLink;
      console.log(`Download link received: ${downloadLink}`);

      const response = await axios({
        method: "GET",
        url: downloadLink,
        responseType: "stream"
      });

      const time = Date.now();
      const path = __dirname + `/cache/${time}.mp4`;
      console.log(`Saving video to: ${path}`);
      response.data.pipe(fs.createWriteStream(path));

      response.data.on('end', async () => {
        console.log(`Download completed for ${url}`);
        api.sendMessage({
          body: `✅ Downloaded.`,
          attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
      });
    } catch (err) {
      console.error(`Error downloading video: ${err.message}`);
      api.sendMessage("An error occurred while downloading the video.", event.threadID, event.messageID);
    }
  }
};
