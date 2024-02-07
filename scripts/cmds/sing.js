module.exports = {
  config: {
    name: "sing", 
    version: "1.0",
    role: 0,
    author: "kshitiz",
    cooldowns: 40,
    shortdescription: "send YouTube audio",
    longdescription: "",
    category: "audio", 
    usages: "{pn} song name",
    dependencies: {
      "fs-extra": "",
      "request": "",
      "axios": "",
      "@distube/ytdl-core": "", 
      "yt-search": ""
    }
  },

  onStart: async ({ api, event }) => {
    const fs = require("fs-extra");
    const ytdl = require("@distube/ytdl-core");
    const yts = require("yt-search");

    const input = event.body;
    const text = input.substring(12);
    const data = input.split(" ");

    if (data.length < 2) {
      return api.sendMessage("Please specify a song name.", event.threadID);
    }

    data.shift();
    const songName = data.join(" ");

    try {
      api.sendMessage(`✅ | Searching song for "${songName}".\n⏳ | Please wait...`, event.threadID);

      const searchResults = await yts(songName);
      if (!searchResults.videos.length) {
        return api.sendMessage("No song found.", event.threadID, event.messageID);
      }

      const song = searchResults.videos[0];
      const songUrl = song.url;

      const stream = ytdl(songUrl, { filter: "audioonly" }); 

      const fileName = `${event.senderID}.mp3`;
      const filePath = __dirname + `/tmp/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading song: ${info.videoDetails.title}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID);
        }

        const message = {
          body: `🎵 | Here's your song\n\n🔮 | Title: ${song.title}\n⏰ | Duration: ${song.duration.timestamp}`,
          attachment: fs.createReadStream(filePath)
        };

        api.sendMessage(message, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('An error occurred while processing the command.', event.threadID);
    }
  }
};
