const axios = require('axios');
const fs = require('fs-extra');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

module.exports = {
  config: {
    name: 'song',
    version: '2.0',
    role: 0,
    author: 'Music',
    cooldowns: 5,
    shortDescription: 'Music',
    longDescription: 'Music',
    category: 'Media',
    guide: {
      en: '{pn} <music>',
    },
    dependencies: {
      'fs-extra': '',
      'axios': '',
      'ytdl-core': '',
      'yt-search': '',
    },
  },

  onStart: async function ({ api, event }) {
    try {
      function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
      }

      const input = event.body;
      const text = input.substring(5);
      const data = input.split(' ');

      if (data.length < 2) {
        return api.sendMessage('Please specify a music name!', event.threadID, event.messageID);
      }

      data.shift();
      const musicName = data.join(' ');

      api.setMessageReaction('⌛', event.messageID, () => { }, true);

      const searchResults = await yts(musicName);
      if (!searchResults.videos.length) {
        api.sendMessage('No music found.', event.threadID, event.messageID);
        return;
      }

      const music = searchResults.videos[0];
      const musicUrl = music.url;

      const stream = ytdl(musicUrl, { filter: 'audioonly' });

      const fileName = `${event.senderID}.mp3`;
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
        fetchAndSendMusic(api, event, music, filePath, formatFileSize);
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('Sorry, an error occurred while processing the command.', event.threadID, event.messageID);
    }
  },
};

async function fetchAndSendMusic(api, event, music, filePath, formatFileSize) {
  try {
    const fileSize = formatFileSize(fs.statSync(filePath).size);
    const musicDuration = music.duration.timestamp;

    api.setMessageReaction('🎼', event.messageID, () => { }, true);

    const userInfo = await api.getUserInfo(event.senderID);
    const username = userInfo[event.senderID]?.name || 'User';

    const message = `${username}, Here's your music\n\nTitle - ${music.title}\n⏰╭ Duration - ${musicDuration}\n📥╰ File size - ${fileSize}`;

    api.sendMessage({
      body: message,
      attachment: fs.createReadStream(filePath),
      mentions: [
        {
          tag: username,
          id: event.senderID,
        },
      ],
    }, event.threadID, () => {
      try {
        fs.unlinkSync(filePath);
      } catch (deleteError) {
        console.error('[ERROR] Deleting File', deleteError);
      }
    }, event.messageID);
  } catch (error) {
    console.error('[ERROR]', error);
    api.sendMessage('Sorry, an error occurred while processing the command.', event.threadID, event.messageID);
  }
}
