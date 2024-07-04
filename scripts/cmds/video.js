const axios = require("axios");
const fs = require("fs-extra");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

module.exports = {
  config: {
    name: "video",
    aliases: ["v"],
    version: "1.3",
    role: 0,
    author: "AceGun",
    cooldowns: 5,
    shortdescription: "download music video from YouTube",
    longdescription: "",
    category: "music",
    usages: "{pn} video name",
    dependencies: {
      "fs-extra": "^10.0.0",  // Specify version for each dependency
      "request": "^2.88.2",
      "axios": "^0.24.0",
      "ytdl-core": "^5.0.5",
      "yt-search": "^2.6.1"
    }
  },

  onStart: async ({ api, event }) => {
    const input = event.body;
    const text = input.substring(12);
    const data = input.split(" ");

    if (data.length < 2) {
      return api.sendMessage("Please specify a video name.", event.threadID);
    }

    data.shift();
    const videoName = data.join(" ");

    try {
      api.setMessageReaction("⏳", event.messageID, event.messageID, api);
      const searchMessage = await api.sendMessage(`💁 | Finding video for "${videoName}".\n⏳ | Please wait...`, event.threadID);

      const searchResults = await yts(videoName);
      if (!searchResults.videos.length) {
        return api.sendMessage("No videos found.", event.threadID, event.messageID);
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;

      const stream = ytdl(videoUrl, { filter: "audioandvideo" });

      const fileName = `${event.senderID}.mp4`;
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
          return api.sendMessage('❌ | The file could not be sent because it is larger than 25MB.', event.threadID);
        }

        const message = {
          body: `💁‍♀️ | Here's your video\n\n🔮 | Title: ${video.title}\n⏰ | Duration: ${video.duration.timestamp}`,
          attachment: fs.createReadStream(filePath)
        };

        api.unsendMessage(searchMessage.messageID);
        api.setMessageReaction("🎥", event.messageID, event.messageID, api);
        
        api.sendMessage(message, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('🥺 | An error occurred while processing the command.', event.threadID);
    }
  }
};