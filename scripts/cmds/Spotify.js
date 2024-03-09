const axios = require("axios");
const fs = require('fs-extra');
const { getStreamFromURL, shortenURL, randomString } = global.utils;

module.exports = {
  config: {
    name: "spotify",
    version: "1.0",
    author: "Kshitiz",
    countDown: 10,
    role: 0,
    shortDescription: "play song from spotify",
    longDescription: "play song from spotify",
    category: "music",
    guide: "{pn} sing songname"
  },

  onStart: async function ({ api, event, args, message }) {
    const a = await message.reply("downloading your song🕐..");

    try {
      let b = '';

      const c = async () => {
        const d = event.messageReply.attachments[0];
        if (d.type === "audio" || d.type === "video") {
          const e = await shortenURL(d.url);
          const f = await axios.get(`https://youtube-music-sooty.vercel.app/kshitiz?url=${encodeURIComponent(e)}`);
          return f.data.title;
        } else {
          throw new Error("Invalid attachment type.");
        }
      };

      if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        b = await c();
      } else if (args.length === 0) {
        throw new Error("Please provide a song name.");
      } else {
        b = args.join(" ");
      }

      const g = await axios.get(`https://spotify-play-iota.vercel.app/spotify?query=${encodeURIComponent(b)}`);
      const h = g.data.trackURLs;
      if (!h || h.length === 0) {
        throw new Error("No track found for the provided song name.");
      }

      const i = h[0];
      const j = await axios.get(`https://sp-dl-bice.vercel.app/spotify?id=${encodeURIComponent(i)}`);
      const k = j.data.download_link;

      const l = await downloadTrack(k);

      const m = await shortenURL(k);

      await message.reply({
        body: `🎧 Playing: ${b}\nDownload Link: ${m}`,
        attachment: fs.createReadStream(l)
      });

      console.log("Audio sent successfully.");

    } catch (n) {
      console.error("Error occurred:", n);
      message.reply(`An error occurred: ${n.message}`);
    } finally {
      message.unsend(a.messageID);
    }
  }
};

async function downloadTrack(url) {
  const o = await getStreamFromURL(url);
  const p = `${__dirname}/cache/${randomString()}.mp3`;
  const q = fs.createWriteStream(p);
  o.pipe(q);

  return new Promise((resolve, reject) => {
    q.on('finish', () => resolve(p));
    q.on('error', reject);
  });
}
