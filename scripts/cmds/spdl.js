const axios = require("axios");
const fs = require('fs');

function formatSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

module.exports = {
  config: {
    name: "spdl",
    version: "1.0",
    author: "Rishad",
    countDown: 10,
    role: 0,
    shortDescription: "Download Spotify musics by searching",
    longDescription: "Download Spotify musics by searching",
    category: "music",
    guide: "{pn} goosebumps"
  },

  onStart: async function ({ api, event, args, message }) {
    const query = args.join(" ");

    if (!query) {
      return message.reply("Baka 🗿 provide a track name.");
    }

    const searchApiUrl = `https://for-devs.onrender.com/api/spsearch?apikey=fuck&query=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(searchApiUrl);
      const searchResults = response.data.slice(0, 6);

      if (searchResults.length === 0) {
        return message.reply("❎ No tracks found for the given query.");
      }

      const trackInfo = searchResults.map((track, index) =>
        `${index + 1}. ${track.title}\nArtists: ${track.artists}\nDuration: ${track.duration}\nTrack: ${track.url}`
      ).join("\n\n");

      const thumbnails = searchResults.map((track) => track.thumbnail);

      const attachments = await Promise.all(
        thumbnails.map((thumbnail) =>
          global.utils.getStreamFromURL(thumbnail)
        )
      );

      const replyMessage = await message.reply({
        body: `${trackInfo}\n\nReply with the sone number to choose.`,
        attachment: attachments
      });

      const data = {
        commandName: this.config.name,
        messageID: replyMessage.messageID,
        tracks: searchResults,
        currentIndex: 6,
        originalQuery: query,
      };
      global.GoatBot.onReply.set(replyMessage.messageID, data);
    } catch (error) {
      console.error(error);
      api.sendMessage(`Error: ${error.message}`, event.threadID);
    }
  },

  onReply: async function ({ api, event, Reply, args, message }) {
    const userInput = args[0].toLowerCase();
    const { tracks, currentIndex, originalQuery } = Reply;

    if (!isNaN(userInput) && userInput >= 1 && userInput <= tracks.length) {
      const selectedTrack = tracks[userInput - 1];
      message.unsend(Reply.messageID);

      const downloadingMessage = await message.reply(`✅ Downloading track "${selectedTrack.title}"`);

      const SpdlApiUrl = 'https://for-devs.onrender.com/api/spotifydl?apikey=fuck&url=' + encodeURIComponent(selectedTrack.url);

      try {
        const apiResponse = await axios.get(SpdlApiUrl);

        if (apiResponse.data.id) {
          const {
            artists,
            title,
            album,
            releaseDate,
            downloadUrl
          } = apiResponse.data;

          const audioResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
          fs.writeFileSync(__dirname + '/cache/spotifyAudio.mp3', Buffer.from(audioResponse.data));

          const fileSize = fs.statSync(__dirname + '/cache/spotifyAudio.mp3').size;
          const sizeFormatted = formatSize(fileSize);

          const attachment = fs.createReadStream(__dirname + '/cache/spotifyAudio.mp3');

          const form = {
            body: `🎶 Now playing:\n\n👤 Artists: ${artists}\n🎵 Title: ${title}\n📀 Album: ${album}\n📅 Release Date: ${releaseDate}\n📦 Size: ${sizeFormatted}`,
            attachment: attachment
          };

          message.reply(form);
        } else {
          message.reply("Sorry, the Spotify content could not be downloaded. Please make sure the URL is valid.");
        }
      } catch (error) {
        console.error(error);
        message.reply("Sorry, an error occurred while processing your request. Please try again later.");
      }

      message.unsend(downloadingMessage.messageID);
    }
  }
};