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
    name: "spotify",
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

    const SearchapiUrl = `https://for-devs.onrender.com/api/spsearch?apikey=fuck&query=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(SearchapiUrl);
      const tracks = response.data.slice(0, 6);

      if (tracks.length === 0) {
        return message.reply("❎ No tracks found for the given query.");
      }

      const topTrack = tracks[0]; // Selecting the top track

      const SpdlApiUrl = 'https://for-devs.onrender.com/api/spotifydl?apikey=fuck&url=' + encodeURIComponent(topTrack.url);

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
          body: `🎶 Now playing:\n\n🎵 Title: ${title}\n👤 Artists: ${artists}`,
          attachment: attachment
        };

        message.reply(form);
      } else {
        message.reply("Sorry, the Spotify content could not be downloaded.");
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("Error: " + error, event.threadID);
    }
  },

  // The rest of your code...
};