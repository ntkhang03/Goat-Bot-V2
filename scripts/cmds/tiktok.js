const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function getStreamFromURL(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

async function fetchTikTokVideos(keyword) {
  try {
    const response = await axios.get(`https://tiktok-0woq.onrender.com/kshitiz?keyword=${keyword}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  config: {
    name: "tiktok",
    aliases: [],
    author: "kshitiz",
    version: "1.0",
    shortDescription: {
      en: "Play TikTok video",
    },
    longDescription: {
      en: "Play a TikTok video by providing keyword",
    },
    category: "fun",
    guide: {
      en: "{p}{n} [keyword]",
    },
  },
  onStart: async function ({ api, event, args }) {
    const keyword = args.join(' ');

    if (!keyword) {
      api.sendMessage({ body: 'Please provide a keyword.\nExample: {p}tiktok dance' }, event.threadID);
      return;
    }

    const videos = await fetchTikTokVideos(keyword);

    if (!videos || videos.length === 0) {
      api.sendMessage({ body: `No TikTok videos found for the keyword: ${keyword}.` }, event.threadID, event.messageID);
      return;
    }

    const videoTitles = videos.map((video, index) => `${index + 1}. ${video.title}`);
    const message = `Choose a video by replying with its number:\n\n${videoTitles.join('\n')}`;

    const tempFilePath = path.join(os.tmpdir(), 'tiktok_response.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(videos));

    api.sendMessage({ body: message }, event.threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: 'tiktok',
        messageID: info.messageID,
        author: event.senderID,
        tempFilePath,
      });
    });
  },
  onReply: async function ({ api, event, Reply, args }) {
    const { author, commandName, tempFilePath } = Reply;

    if (event.senderID !== author || !tempFilePath) {
      return;
    }

    const videoIndex = parseInt(args[0], 10);

    if (isNaN(videoIndex) || videoIndex <= 0) {
      api.sendMessage({ body: 'Invalid input.\nPlease provide a valid number.' }, event.threadID, event.messageID);
      return;
    }

    try {
      const videos = JSON.parse(fs.readFileSync(tempFilePath, 'utf-8'));

      if (!videos || videos.length === 0 || videoIndex > videos.length) {
        api.sendMessage({ body: 'Invalid video number.\nPlease choose a number within the range.' }, event.threadID, event.messageID);
        return;
      }

      const selectedVideo = videos[videoIndex - 1];
      const videoUrl = selectedVideo.videoUrl;

      if (!videoUrl) {
        api.sendMessage({ body: 'Error: Video not found.' }, event.threadID, event.messageID);
        return;
      }

      const videoStream = await getStreamFromURL(videoUrl);

      await api.sendMessage({
        body: `Here is your TikTok video:`,
        attachment: videoStream,
      }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: 'An error occurred while processing the video.\nPlease try again later.' }, event.threadID, event.messageID);
    } finally {
      fs.unlinkSync(tempFilePath);
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};
