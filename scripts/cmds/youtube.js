const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function getStreamDataFromURL(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

async function downloadFile(url, filePath) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(filePath, Buffer.from(response.data));
}

module.exports = {
  config: {
    name: "youtube",
    aliases: [],
    author: "kshitiz",
    version: "1.0",
    shortDescription: {
      en: "Play YouTube video ",
    },
    longDescription: {
      en: "Play a YouTube video ",
    },
    category: "media",
    guide: {
      en: "{p}{n} [keyword] / reply by number",
    },
  },
  onStart: async function ({ api, event, args }) {
    const keyword = args.join(' ');

    if (!keyword) {
      api.sendMessage({ body: 'Please provide a keyword.\nExample: {p}youtube dance' }, event.threadID);
      return;
    }

    const videos = await fetchYouTubeVideos(keyword);

    if (!videos || videos.length === 0) {
      api.sendMessage({ body: `No YouTube videos found for the keyword: ${keyword}.` }, event.threadID);
      return;
    }

    const videoTitles = videos.map((video, index) => `${index + 1}. ${video.title}`);
    const message = `Choose a video by replying with number:`;

    const tempFilePath = path.join(os.tmpdir(), 'youtube_response.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(videos));


    const thumbnailPaths = [];
    for (let i = 0; i < Math.min(5, videos.length); i++) {
      const thumbnailUrl = videos[i].thumbnail;
      const thumbnailPath = path.join(os.tmpdir(), `thumbnail_${event.threadID}_${i + 1}.jpg`);
      await downloadFile(thumbnailUrl, thumbnailPath);
      thumbnailPaths.push(thumbnailPath);
    }

    const thumbnailStreams = thumbnailPaths.map((thumbnailPath) => fs.createReadStream(thumbnailPath));

    await api.sendMessage({
      attachment: thumbnailStreams,
      body: message,
    }, event.threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: 'youtube',
        messageID: info.messageID,
        author: event.senderID,
        tempFilePath,
        thumbnailPaths,
      });
    });
  },
  onReply: async function ({ api, event, Reply, args }) {
    const { author, commandName, tempFilePath, thumbnailPaths } = Reply;

    if (event.senderID !== author || !tempFilePath) {
      return;
    }

    const videoIndex = parseInt(args[0], 10);

    if (isNaN(videoIndex) || videoIndex <= 0) {
      api.sendMessage({ body: 'Invalid input.\nPlease provide a valid number.' }, event.threadID);
      return;
    }

    try {
      const videos = JSON.parse(fs.readFileSync(tempFilePath, 'utf-8'));

      if (!videos || videos.length === 0 || videoIndex > videos.length) {
        api.sendMessage({ body: 'Invalid video number.\nPlease choose a number within the range.' }, event.threadID);
        return;
      }

      const selectedVideo = videos[videoIndex - 1];
      const videoUrl = selectedVideo.videoUrl;

      if (!videoUrl) {
        api.sendMessage({ body: 'Error: Video not found.' }, event.threadID);
        return;
      }


      const videoStream = await getStreamDataFromURL(videoUrl);

      await api.sendMessage({
        body: `Here is your video:`,
        attachment: videoStream,
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage({ body: 'An error occurred while processing the video.\nPlease try again later.' }, event.threadID);
    } finally {

     // thumbnailPaths.forEach((thumbnailPath) => fs.unlinkSync(thumbnailPath));
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};

async function fetchYouTubeVideos(keyword) {
  const options = {
    method: 'GET',
    url: 'https://youtube-83yw.onrender.com/kshitiz',
    params: {
      query: keyword,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
