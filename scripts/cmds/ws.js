const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "ws",
    aliases: [],
    author: "aminul",
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "Search for wallpapers based on a keyword."
    },
    category: "image",
    guide: {
      en: "{p}ws <keyword> [amount]\nExample: {p}ws nature 3"
    }
  },
  onStart: async function ({ api, event, args }) {
    if (args.length < 1) {
      api.sendMessage('Please provide a keyword for the wallpaper search.', event.threadID, event.messageID);
      return;
    }

    const keyword = args[0];
    let amount = args[1] || 1;

    amount = parseInt(amount);
    if (isNaN(amount) || amount <= 0) {
      api.sendMessage('Please provide a valid positive integer for the amount.', event.threadID, event.messageID);
      return;
    }

    try {
     
      await fs.ensureDir('cache');

      const response = await axios.get(`https://antr4x.onrender.com/get/searchwallpaper?keyword=${keyword}`);

      if (response.data.status && response.data.img.length > 0) {
        amount = Math.min(amount, response.data.img.length);

        const imgData = [];
        for (let i = 0; i < amount; i++) {
          const image = response.data.img[i];
          const imageName = `wallpaper_${i + 1}.jpg`;
          const imagePath = path.join('cache', imageName);

          try {
            const imageResponse = await axios.get(image, { responseType: 'arraybuffer' });
            await fs.writeFile(imagePath, Buffer.from(imageResponse.data, 'binary'));
            imgData.push(imagePath);
          } catch (error) {
            console.error("Error downloading image:", error);
            api.sendMessage('An error occurred while downloading images. Please try again later.', event.threadID, event.messageID);
            return;
          }
        }

        api.sendMessage({
          attachment: imgData.map(imgPath => fs.createReadStream(imgPath)),
          body: `Wallpapers based on '${keyword}' 🌟`,
        }, event.threadID, (err) => {
          if (err) console.error("Error sending images:", err);

          imgData.forEach(imgPath => {
            fs.unlinkSync(imgPath);
          });
        });
      } else {
        api.sendMessage('No wallpapers found for the given keyword.', event.threadID, event.messageID);
      }
    } catch (error) {
      console.error('Error fetching wallpaper images:', error);
      api.sendMessage('please provide a single keyword\or try again with diff keywords', event.threadID, event.messageID);
    }
  },
};
