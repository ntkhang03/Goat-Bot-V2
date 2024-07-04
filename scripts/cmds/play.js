const fs = require("fs-extra");
const ytdl = require("@neoxr/ytdl-core");
const yts = require("yt-search");
const axios = require('axios');
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "play",
    version: "1.4",
    author: "hedroxyy",
    countDown: 5,
    role: 0,
    category: "media",
  },

  onStart: async function ({ api, event, message }) {
    try {
      let query = '';

    
      if (event.type === "message_reply" && ["audio", "video"].includes(event.messageReply.attachments[0].type)) {
        const attachmentUrl = event.messageReply.attachments[0].url;

        
        const transcription = await extractTextFromAudio(attachmentUrl);

        
        query = transcription.split('\n')[0];
      } else {
        
        const input = event.body;
        const data = input.split(" ");

        if (data.length < 2) {
          return message.reply("Please put a song");
        }

        data.shift();
        query = data.join(" ");
      }

     
      const originalMessage = await message.reply(`Searching for "${query}"...`);
      const searchResults = await yts(query);

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
        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return message.reply('[ERR] The file could not be sent because it is larger than 25MB.');
        }
        const replyMessage = {
          body: `💗`,
          attachment: fs.createReadStream(filePath),
        };
        await api.unsendMessage(originalMessage.messageID);
        await message.reply(replyMessage, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });
    } catch (error) {
      console.error('[ERROR]', error);
      message.reply("An error occurred while processing the request.");
    }
  },
};


async function extractTextFromAudio(audioUrl) {
  try {
    const response = await axios.get(`https://milanbhandari.onrender.com/transcribe?url=${encodeURIComponent(audioUrl)}`);
    return response.data.transcript || '';
  } catch (error) {
    console.error('[ERROR]', error);
    return '';
  }
}
