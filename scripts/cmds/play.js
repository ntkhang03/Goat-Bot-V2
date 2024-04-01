module.exports = {
  config: {
    name: "play",
    version: "1.0",
    role: 0,
    author: "KSHITIZ",
    cooldowns: 5,
    shortdescription: "play song with lyrics",//use offical music name 
    longdescription: "always use official music title for lyrics",
    category: "music",
    usages: "{pn} play (song name)",
    dependencies: {
      "fs-extra": "",
      "request": "",
      "axios": "",
      "ytdl-core": "",
      "yt-search": ""
    }
  },

  onStart: async ({ api, event }) => {
    const axios = require("axios");
    const fs = require("fs-extra");
    const ytdl = require("ytdl-core");
    const request = require("request");
    const yts = require("yt-search");

    const input = event.body;
    const text = input.substring(12);
    const data = input.split(" ");

    if (data.length < 2) {
      return api.sendMessage("Please write music name", event.threadID);
    }

    data.shift();
    const song = data.join(" ");

    try {
      api.sendMessage(`🕵️‍♂️ | Searching Lyrics and Music for "${song}".\n⏳ | Please wait...🤍`, event.threadID);

      const res = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(song)}`);
      const lyrics = res.data.lyrics || "Not found!";
      const title = res.data.title || "Not found!";
      const artist = res.data.artist || "Not found!";

      const searchResults = await yts(song);
      if (!searchResults.videos.length) {
        return api.sendMessage("Error: Invalid request.", event.threadID, event.messageID);
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;

      const stream = ytdl(videoUrl, { filter: "audioonly" });

      const fileName = `${event.senderID}.mp3`;
      const filePath = __dirname + `/cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('[ERR] The file could not be sent because it is larger than 25MB.', event.threadID);
        }

        const message = {
          body: `🔖Miss luna \n❏Title: ${title}\n❏Artist: ${artist}\n\n❏Lyrics: ${lyrics}`,
          attachment: fs.createReadStream(filePath)
        };

        api.sendMessage(message, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('try again later > error.', event.threadID);
    }
  }
};
