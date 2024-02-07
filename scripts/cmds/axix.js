const axios = require("axios");
const fs = require("fs-extra");
const os = require("os");
const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");
module.exports = {
  sentMusic: [],

  config: {
    name: "axix",
    version: "2.0",
    role: 0,
    author: "𝗞𝘀𝗵𝗶𝘁𝗶𝘇 & 𝗦𝗞𝗬",
    cooldowns: 40,
    shortDescription: "Fetch a random music song of axix band",
    longDescription: "Fetch a random music song of axix band",
    category: "𝗠𝗨𝗦𝗜𝗖",
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

      const loadingMessage = await api.sendMessage("𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗺𝘂𝘀𝗶𝗰 𝗼𝗳 𝗮𝘅𝗶𝘅 𝗯𝗮𝗻𝗱 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁... 🎵", event.threadID, null, event.messageID);

      const apiKey = "AIzaSyAO1tuGus4-S8RJID51f8WJAM7LXz1tVNc";
      const playlistId = "PLCiXFxWx8d2CdDHJJcorbqpD9IBZ_GZbf";

      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=contentDetails&maxResults=50`;
      const response = await axios.get(playlistUrl);

      const items = response.data.items;
      const videoIds = items.map((item) => item.contentDetails.videoId);

      if (this.sentMusic.length === videoIds.length) {
        this.sentMusic = [];
      }

      const unwatchedVideoIds = videoIds.filter((videoId) => !this.sentMusic.includes(videoId));

      if (unwatchedVideoIds.length === 0) {
        api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("No unwatched music tracks left.", event.threadID, null, event.messageID);
      }

      const randomVideoId = unwatchedVideoIds[Math.floor(Math.random() * unwatchedVideoIds.length)];

      this.sentMusic.push(randomVideoId);

      const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${randomVideoId}&part=snippet`;
      const videoResponse = await axios.get(videoDetailsUrl);

      const videoInfo = videoResponse.data.items[0].snippet;

      const randomMusicTitle = videoInfo.title;

      const cacheFilePath = os.tmpdir() + "/randomMusicTitle.txt";
      fs.writeFileSync(cacheFilePath, randomMusicTitle);

      const searchResults = await yts(randomMusicTitle);

      if (!searchResults.videos.length) {
        api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("No music track found based  title.", event.threadID, null, event.messageID);
      }

      const foundVideo = searchResults.videos[0];
      const videoUrl = foundVideo.url;

      const stream = ytdl(videoUrl, { filter: "audioonly" });
      const fileName = `${senderID}.mp3`;
      const filePath = __dirname + `/cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading music: ${info.videoDetails.title}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          api.unsendMessage(loadingMessage.messageID);
          return api.sendMessage('❌ | The file could not be sent because it is larger than 25MB.', event.threadID, null, event.messageID);
        }

        const message = {
          body: `🎵 | 𝗛𝗲𝗿𝗲'𝘀 𝘁𝗵𝗲 𝗿𝗮𝗻𝗱𝗼𝗺 𝗺𝘂𝘀𝗶𝗰 𝗼𝗳 𝗮𝘅𝗶𝘅 𝗯𝗮𝗻𝗱:\n\n🔮 | 𝗧𝗶𝘁𝗹𝗲: ${randomMusicTitle}\n⏰| 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${foundVideo.duration.timestamp}`,
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
