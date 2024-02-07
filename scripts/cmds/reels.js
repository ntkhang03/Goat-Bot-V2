const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function downloadImage(url, destination) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(destination, Buffer.from(response.data, 'binary'));
}

module.exports = {
  config: {
    name: "reels",
    aliases: [],
    author: "kshitiz",
    version: "1.1",
    shortDescription: {
      en: "View Instagram reels by username",
    },
    longDescription: {
      en: "View Instagram reels by providing the username and Reply with the reel list by number",
    },
    category: "FUN",
    guide: {
      en: "{p}reels [username]",
    },
  },
  onStart: async function ({ api, event, args }) {
    const username = args[0];

    if (!username) {
      api.sendMessage({ body: 'Please provide an Instagram username.\nExample: {p}reels username' }, event.threadID, event.messageID);
      return;
    }

    const reels = await fetchInstagramReels(username);

    if (!reels || reels.length === 0) {
      api.sendMessage({ body: `No Instagram reels found for ${username}.` }, event.threadID, event.messageID);
      return;
    }

    const reelTitles = reels.map((reel, index) => `${index + 1}. Reel ${reel.id}`);
    const message = `Choose a reel by replying with its number:\n\n${reelTitles.join('\n')}`;

    const tempFilePath = path.join(os.tmpdir(), 'reels_response.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(reels));

    api.sendMessage({ body: message }, event.threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: 'reels',
        messageID: info.messageID,
        author: event.senderID,
        tempFilePath,
      });
    });
  },
  onReply: async function ({ api, event, Reply, args }) {
    const { author, commandName, tempFilePath } = Reply;

    if (event.senderID !== author || !tempFilePath) {
      return;
    }

    const reelIndex = parseInt(args[0], 10);

    if (isNaN(reelIndex) || reelIndex <= 0) {
      api.sendMessage({ body: 'Invalid input.\nPlease provide a valid number.' }, event.threadID, event.messageID);
      return;
    }

    try {
      const reels = JSON.parse(fs.readFileSync(tempFilePath, 'utf-8'));

      if (!reels || reels.length === 0 || reelIndex > reels.length) {
        api.sendMessage({ body: 'Invalid reel number.\nPlease choose a number within the range.' }, event.threadID, event.messageID);
        return;
      }

      const selectedReel = reels[reelIndex - 1];
      const reelUrl = selectedReel.video_url;

      if (!reelUrl) {
        api.sendMessage({ body: 'Error: Reel not found.' }, event.threadID, event.messageID);
        return;
      }

      const tempReelPath = path.join(os.tmpdir(), 'reels_video.mp4');
      await downloadImage(reelUrl, tempReelPath);

     
      await api.sendMessage({
        body: `Here is the Instagram reel:`,
        attachment: fs.createReadStream(tempReelPath),
      }, event.threadID, event.messageID);

      
      fs.unlinkSync(tempReelPath);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: 'An error occurred while processing the reel.\nPlease try again later.' }, event.threadID, event.messageID);
    } finally {
      fs.unlinkSync(tempFilePath);
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};

async function fetchInstagramReels(username) {
  const options = {
    method: 'GET',
    url: 'https://instagram-scraper-api2.p.rapidapi.com/v1.2/reels',
    params: {
      username_or_id_or_url: username,
    },
    headers: {
      'X-RapidAPI-Key': '3fa82b3121msh60993f970f09819p15c22cjsncc0b065b5f1c',
      'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data.items;
  } catch (error) {
    console.error(error);
    return null;
  }
}
