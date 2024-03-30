const axios = require("axios");
const fs = require("fs-extra");
const os = require("os");
const yts = require("yt-search");
const ytdl = require("ytdl-core");

module.exports = {
  sentVideos: [],

  config: {
    name: "aniedit",
    version: "2.0",
    role: 0,
    author: "Kshitiz & SKY",
    cooldowns: 5,
    shortDescription: "Fetch a random video from a YouTube playlist and send it",
    longDescription: "",
    category: "anime",
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "ytdl-core": "",
      "yt-search": ""
    }
  },
  onStart: async function ({ api, event, message }) {
    try {
      const senderID = event.senderID;

      const loadingMessage = await api.sendMessage("Fetching a random video anime video. Please wait...", event.threadID, null, event.messageID);

      const apiKey = "AIzaSyAO1tuGus4-S8RJID51f8WJAM7LXz1tVNc";
      const playlistId = "PLhTrUQSOqTqKBA4VWSN_VqqOb7xx4-VEY";

      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=contentDetails&maxResults=50`;
      const response = await axios.get(playlistUrl);

      const items = response.data.items;
      const videoIds = items.map((item) => item.contentDetails.videoId);

      if (this.sentVideos.length === videoIds.length) {

        this.sentVideos = [];
      }

      const unwatchedVideoIds = videoIds.filter((videoId) => !this.sentVideos.includes(videoId));

      if (unwatchedVideoIds.length === 0) {

        api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("No unwatched videos left in the playlist.", event.threadID, null, event.messageID);
      }

      const randomVideoId = unwatchedVideoIds[Math.floor(Math.random() * unwatchedVideoIds.length)];

      this.sentVideos.push(randomVideoId);

      const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${randomVideoId}&part=snippet`;
      const videoResponse = await axios.get(videoDetailsUrl);

      const videoInfo = videoResponse.data.items[0].snippet;

      const randomVideoTitle = videoInfo.title;

      const cacheFilePath = os.tmpdir() + "/randomVideoTitle.txt";
      fs.writeFileSync(cacheFilePath, randomVideoTitle);

      const searchResults = await yts(randomVideoTitle);

      if (!searchResults.videos.length) {

        api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("No video found based on the cached title.", event.threadID, null, event.messageID);
      }

      const foundVideo = searchResults.videos[0];
      const videoUrl = foundVideo.url;

      const stream = ytdl(videoUrl, { filter: "audioandvideo" });
      const fileName = `${senderID}.mp4`;
      const filePath = __dirname + `/cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading video: ${info.videoDetails.title}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);

          api.unsendMessage(loadingMessage.messageID);
          return api.sendMessage('❌ | The file could not be sent because it is larger than 25MB.', event.threadID, null, event.messageID);
        }

        const message = {
          body: `📹 | Here's the random anime video b\n\n🔮 | Title: ${randomVideoTitle}\n⏰ | Duration: ${foundVideo.duration.timestamp}`,
          attachment: fs.createReadStream(filePath)
        };

        api.sendMessage(message, event.threadID, null, event.messageID, () => {
          fs.unlinkSync(filePath);
        });


        setTimeout(() => {
          api.unsendMessage(loadingMessage.messageID);
        }, 10000);
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('An error occurred while processing the command.', event.threadID, null, event.messageID);
    }
  },
};
