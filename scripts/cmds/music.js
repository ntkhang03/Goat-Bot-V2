const axios = require("axios");
const fs = require("fs-extra");
const os = require("os");
const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");

module.exports = {
  sentMusic: { english: [], nepali: [], hindi: [], batman:[], legend: [], lovely:[], norzum:[], baig:[], talha:[], taylor:[] },

  music: {
    english: ["PLMC9KNkIncKseYxDN2niH6glGRWKsLtde"],//yeutai song maa aru playlist id halna ["", "", ""],
    nepali: ["PLqT4Y_q-m4nCujUP2qDnGMQm5KNicw1GQ"],
    hindi: ["PLaPLzpOlr3JRAr7L8NIRJsNhsNtLhM5Ln"],
    batman:
["PLqT4Y_q-m4nDNBUXrTxVscTLb7DBcbr6Y"],
    legend: ["PL78ppHMLFyhSIfD8KvMRJdKDruU2h3UIa"],
    lovely: ["PLI_l1q-WZI9nIsMDTy3i1SEc-1JDywQY-"],
    norzum: ["PL1TrQgiilM_Y1oGwdcGdpnu_XIig_lURL"],
    baig: ["PL-VHaeKT1xxMZAkHXPsGH1FGn7KjaO_MP"],
    talha: ["PLRfp0rC-SGyKmLT6vFiqvj-XerWYoBujc"],
    taylor: ["PLc8BjX57_to8WP2WO6HlzL9R-TTX21oBM"], 
  },

  config: {
    name: "music",
    version: "2.0",
    role: 0,
    author: "𝗞𝘀𝗵𝗶𝘁𝗶𝘇 & 𝗦𝗞𝗬",
    cooldowns: 40,
    shortDescription: "Fetch a random music track from a YouTube playlist and send it",
    longDescription: "Fetch a random music track from a YouTube playlist and send it",
    category: "music",
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "ytdl-core": "",
      "yt-search": ""
    }
  },
  onStart: async function ({ api, event, message, args }) {
    try {
      const senderID = event.senderID;

      const loadingMessage = await api.sendMessage("𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗺𝘂𝘀𝗶𝗰 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁... 🎵", event.threadID, null, event.messageID);

      if (args.length === 0) {
        const categoryList = Object.keys(this.music).join(', ');
        api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage(`Please type {prefix} music <category>\nAvailable categories: ${categoryList}`, event.threadID, null, event.messageID);
      }

      const category = args[0].toLowerCase();

      if (!this.music.hasOwnProperty(category)) {
        api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage(`Invalid category. Available categories: ${Object.keys(this.music).join(', ')}`, event.threadID, null, event.messageID);
      }

      const playlistId = this.music[category][Math.floor(Math.random() * this.music[category].length)];

      const apiKey = "AIzaSyAO1tuGus4-S8RJID51f8WJAM7LXz1tVNc";

      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=contentDetails&maxResults=50`;
      const response = await axios.get(playlistUrl);

      const items = response.data.items;
      const videoIds = items.map((item) => item.contentDetails.videoId);

      if (this.sentMusic[category].length === videoIds.length) {
        this.sentMusic[category] = [];
      }

      const unwatchedVideoIds = videoIds.filter((videoId) => !this.sentMusic[category].includes(videoId));

      if (unwatchedVideoIds.length === 0) {
        api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("No unwatched music tracks left.", event.threadID, null, event.messageID);
      }

      const randomVideoId = unwatchedVideoIds[Math.floor(Math.random() * unwatchedVideoIds.length)];

      this.sentMusic[category].push(randomVideoId);

      const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${randomVideoId}&part=snippet`;
      const videoResponse = await axios.get(videoDetailsUrl);

      const videoInfo = videoResponse.data.items[0].snippet;

      const randomMusicTitle = videoInfo.title;

      const cacheFilePath = os.tmpdir() + "/randomMusicTitle.txt";
      fs.writeFileSync(cacheFilePath, randomMusicTitle);

      const searchResults = await yts(randomMusicTitle);

      if (!searchResults.videos.length) {
        api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("No music track found based on the title.", event.threadID, null, event.messageID);
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
          body: `🎵 | 𝗛𝗲𝗿𝗲'𝘀 𝘁𝗵𝗲 𝗿𝗮𝗻𝗱𝗼𝗺 𝗺𝘂𝘀𝗶𝗰:\n\n🔮 | 𝗧𝗶𝘁𝗹𝗲: ${randomMusicTitle}\n⏰ Duration: ${foundVideo.duration.timestamp}`,
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
