const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "ws",
    version: "1.0.0",
    author: "kshitiz",
    role: 0,
    countDown: 10,
    shortDescription: {
      en: "Search for wallpapers"
    },
    category: "image",
    guide: {
      en: "{prefix}ws <subcommand> <search query> -<number of images>"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const subCommand = args.shift(); 
      let apiUrl = "";
      switch (subCommand) {
        case "mbl":
          apiUrl = "https://kshitiz-project.vercel.app/mbl";
          break;
        case "pc":
          apiUrl = "https://kshitiz-project.vercel.app/pc";
          break;
        default:
          return api.sendMessage(`invaild.\nex1: ws mbl zoro -1\nex2:ws pc zoro -1`, event.threadID, event.messageID);
      }

      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) {
        return api.sendMessage(`invaild.ex1: ws mbl zoro -1\nex1:ws pc zoro -1`, event.threadID, event.messageID);
      }
      const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
      const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 6;

      const res = await axios.get(`${apiUrl}?q=${encodeURIComponent(keySearchs)}`);
      const data = res.data.data;

      if (!data || !Array.isArray(data) || data.length === 0) {
        return api.sendMessage(`wallpaper not found for "${keySearchs}".`, event.threadID, event.messageID);
      }

      const imgData = [];

      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
        const imageUrl = data[i];

        try {
          const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
          await fs.outputFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        } catch (error) {
          console.error(error);
         
        }
      }

      await api.sendMessage({
        attachment: imgData,
        body: `-wallpaper for you-`
      }, event.threadID, event.messageID);

      await fs.remove(path.join(__dirname, 'cache'));
    } catch (error) {
      console.error(error);
      return api.sendMessage(`An error occurred. Please try again later.`, event.threadID, event.messageID);
    }
  }
};
