const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const ytdl = require("@neoxr/ytdl-core");
const yts = require("yt-search");

module.exports = {
  config: {
    name: "lyrics",
    version: "1.0",
    author: "KAKASHI",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Get lyrics for a song",
    },
    longDescription: {
      en: "This command allows you to get the lyrics for a song. Usage: !lyrics <song name>",
    },
    category: "music",
    guide: {
      en: "{prefix}lyrics <song name>",
    },
  },

  onStart: async function ({ api, event, args }) {
    const songName = args.join(" ");
    if (!songName) {
      api.sendMessage(
        "⛔ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗧𝗜𝗧𝗟𝗘\n\n❁ Please provide a song name!",
        event.threadID,
        event.messageID
      );
      return;
    }

    try {
      // Fetch lyrics
      const lyricsResponse = await axios.get(
        `https://lyrics-api.replit.app/aryan?songName=${encodeURIComponent(songName)}`
      );
      const { lyrics, title, artist, image } = lyricsResponse.data;

      // Fetch song
      const searchResults = await yts(songName);
      if (!searchResults.videos.length) {
        api.sendMessage("❌ 𝗦𝗢𝗡𝗚 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗\n\n❁ Sorry, song not found!", event.threadID, event.messageID);
        return;
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;
      const stream = ytdl(videoUrl, { filter: "audioonly" });
      const fileName = `music.mp3`;
      const filePath = path.join(__dirname, "tmp", fileName);

      stream.pipe(fs.createWriteStream(filePath));

      stream.on("response", () => {
        console.info("[DOWNLOADER]", "Starting download now!");
      });

      stream.on("info", (info) => {
        console.info("[DOWNLOADER]", `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
      });

      stream.on("end", async () => {
        const audioStream = fs.createReadStream(filePath);
        let message = `📌 𝗛𝗘𝗥𝗘 𝗜𝗦 𝗟𝗬𝗥𝗜𝗖𝗦\n\n🎧 𝗧𝗜𝗧𝗟𝗘\n➪ ${title}\n👑 𝗔𝗥𝗧𝗜𝗦𝗧 \n➪ ${artist} \n\n🎶 𝗟𝗬𝗥𝗜𝗖𝗦\n➪ ${lyrics}`;
        let attachment = await global.utils.getStreamFromURL(image);

        api.sendMessage({ body: message, attachment }, event.threadID, (err, info) => {
          let id = info.messageID;
          api.sendMessage({ attachment: audioStream }, event.threadID, () => {
            api.setMessageReaction("✅", id, () => {}, true);
          });
        });
      });
    } catch (error) {
      console.error(error);
      api.sendMessage("Sorry, there was an error getting the lyrics and song!", event.threadID, event.messageID);
    }
  },
};
