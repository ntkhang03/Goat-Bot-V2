const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function downloadVideo(url, destination) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(destination, Buffer.from(response.data, 'binary'));
}

module.exports = {
  config: {
    name: "reels",
    aliases: [],
    author: "kshitiz",
    version: "1.1",
    shortDescription: {
      en: "View Instagram reels by hashtag",
    },
    longDescription: {
      en: "View Instagram reels by providing a hashtag and reply with the reel list by number",
    },
    category: "FUN",
    guide: {
      en: "{p}reels [hashtag]",
    },
  },
  onStart: async function ({ api, event, args }) {
    const hashtag = args[0];

    if (!hashtag) {
      api.sendMessage({ body: 'Please provide a hashtag.\nExample: {p}reels zoro' }, event.threadID, event.messageID);
      return;
    }

    try {
      const response = await axios.get(`https://reels-kshitiz.onrender.com/reels?hashtag=${hashtag}`);
      const videoURLs = response.data.videoURLs;

      if (!videoURLs || videoURLs.length === 0) {
        api.sendMessage({ body: `No reels found for the hashtag ${hashtag}.` }, event.threadID, event.messageID);
        return;
      }

      const message = `Choose a reel by replying with its number:\n\n${videoURLs.map((url, index) => `${index + 1}. sid=472314`).join('\n')}`;
      api.sendMessage({ body: message }, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: 'reels',
          messageID: info.messageID,
          author: event.senderID,
          videoURLs,
        });
      });
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: 'An error occurred while fetching reels.\nPlease try again later.' }, event.threadID, event.messageID);
    }
  },
  onReply: async function ({ api, event, Reply, args }) {
    const { author, commandName, videoURLs } = Reply;

    if (event.senderID !== author || !videoURLs) {
      return;
    }

    const reelIndex = parseInt(args[0], 10);

    if (isNaN(reelIndex) || reelIndex <= 0 || reelIndex > videoURLs.length) {
      api.sendMessage({ body: 'Invalid input.\nPlease provide a valid number.' }, event.threadID, event.messageID);
      return;
    }

    try {
      const selectedVideoURL = videoURLs[reelIndex - 1];

      const tempVideoPath = path.join(os.tmpdir(), 'reels_video.mp4');
      await downloadVideo(selectedVideoURL, tempVideoPath);

      await api.sendMessage({
        body: `Here is the Instagram reel:`,
        attachment: fs.createReadStream(tempVideoPath),
      }, event.threadID, event.messageID);

      fs.unlinkSync(tempVideoPath);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: 'An error occurred while processing the reel.\nPlease try again later.' }, event.threadID, event.messageID);
    } finally {
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};
