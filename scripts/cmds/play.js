const fs = require("fs-extra");
const ytdl = require("@neoxr/ytdl-core");
const yts = require("yt-search");
const axios = require('axios');
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "play",
    version: "1.0", 
    author: "KShitiz",
    countDown: 5,
    role: 0,
    category: "𝗠𝗘𝗗𝗜𝗔",
  },

  onStart: async function ({ api, event, message }) {
    try {
      let song;
      let lyrics;

      if (event.type === "message_reply" && ["audio", "video"].includes(event.messageReply.attachments[0].type)) {
        const attachmentUrl = event.messageReply.attachments[0].url;
        const urls = await tinyurl.shorten(attachmentUrl) || args.join(' ');
        const response = await axios.get(`https://www.api.vyturex.com/songr?url=${urls}`);// api credit jarif

        if (response.data && response.data.title) {
          song = response.data.title;
          lyrics = await getLyrics(song);
        } else {
          return message.reply("Error: Song information not found.");
        }
      } else {
        const input = event.body;
        const text = input.substring(12);
        const data = input.split(" ");

        if (data.length < 2) {
          return message.reply("Please include music title");
        }

        data.shift();
        song = data.join(" ");
        lyrics = await getLyrics(song);
      }

      if (!lyrics) {
        return message.reply("Error: Lyrics not found.");
      }

      const originalMessage = await message.reply(`playing lyrics for "${song}"...`);
      const searchResults = await yts(song);

      if (!searchResults.videos.length) {
        return message.reply("Error: Song not found.");
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;
      const stream = ytdl(videoUrl, { filter: "audioonly" });
      const fileName = `music.mp3`;
      const filePath = `${__dirname}/tmp/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
      });

      stream.on('end', async () => {
        console.info('[DOWNLOADER] Downloaded');
        if (fs.statSync(filePath).size > 87380608) {
          fs.unlinkSync(filePath);
          return message.reply('[ERR] The file could not be sent because it is larger than 83mb.');
        }

        const replyMessage = {
          body: `Title: ${video.title}\nArtist: ${video.author.name}\n\nLyrics:\n${lyrics}`,
          attachment: fs.createReadStream(filePath),
        };

        await api.unsendMessage(originalMessage.messageID);
        await message.reply(replyMessage, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });

    } catch (error) {
      console.error('[ERROR]', error);
      message.reply("This song is not available.");
    }
  },
};

async function getLyrics(song) {
  try {
    const response = await axios.get(`https://lyrist.vercel.app/api/${encodeURIComponent(song)}`);
    if (response.data && response.data.lyrics) {
      return response.data.lyrics;
    } else {
      return null;
    }
  } catch (error) {
    console.error('[LYRICS ERROR]', error);
    return null;
  }
}
