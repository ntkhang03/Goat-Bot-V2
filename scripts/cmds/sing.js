const fs = require("fs-extra");
const ytdl = require("@neoxr/ytdl-core");
const yts = require("yt-search");
const axios = require('axios');
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "sing",
    version: "1.3",
    author: "JARiF",
    countDown: 5,
    role: 0,
    category: "cute",
  },

  onStart: async function ({ api, event, message }) {
    try {
        if (event.type === "message_reply" && ["audio", "video"].includes(event.messageReply.attachments[0].type)) {
            const attachmentUrl = event.messageReply.attachments[0].url;
        const urls = await tinyurl.shorten(attachmentUrl) || args.join(' ');
        const response = await axios.get(`https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview118/v4/65/07/f5/6507f5c5-dba8-f2d5-d56b-39dbb62a5f60/mzaf_1124211745011045566.plus.aac.p.=${urls}`);

        if (response.data && response.data.title) {
          const song = response.data.title;
          const originalMessage = await message.reply(`Searching for "${song}"...`);
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
              body: `Title: ${video.title}\nArtist: ${video.author.name}`,
              attachment: fs.createReadStream(filePath),
            };
            await api.unsendMessage(originalMessage.messageID);
            await message.reply(replyMessage, event.threadID, () => {
              fs.unlinkSync(filePath);
            });
          });
        } else {
          return message.reply("Error: Song information not found.");
        }
      } else {
        const input = event.body;
        const text = input.substring(12);
        const data = input.split(" ");

        if (data.length < 2) {
          return message.reply("Please put a song");
        }

        data.shift();
        const song = data.join(" ");
        const originalMessage = await message.reply(`Searching your song named "${song}"...`);
        const searchResults = await yts(song);

        if (!searchResults.videos.length) {
          return message.reply("Error: Invalid request.");
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
          if (fs.statSync(filePath).size > 26214400) {
            fs.unlinkSync(filePath);
            return message.reply('[ERR] The file could not be sent because it is larger than 25MB.');
          }
          const replyMessage = {
            body: `Title: ${video.title}\nArtist: ${video.author.name}`,
            attachment: fs.createReadStream(filePath),
          };
          await api.unsendMessage(originalMessage.messageID);
          await message.reply(replyMessage, event.threadID, () => {
            fs.unlinkSync(filePath);
          });
        });
      }
    } catch (error) {
      console.error('[ERROR]', error);
      message.reply("This song is not available.");
    }
  },
};
