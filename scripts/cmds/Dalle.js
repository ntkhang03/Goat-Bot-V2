const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "1jN683a3fhzhbvuZLl-tZOylU3ovkJ7-WUC96Lef3dKvyfqano3tQeNGKqZQoFmkiBYnPqHANCshNaq-C0gQcO6J1YXR9vDzwPsNSH5If7DxWExFgeAaOEKVw93TmbOPwh1oJeMhw7p3yAWOfF-i1SklqJ5D8-0CeFT_TvuMTY_R_20MkJUwliTLhKjofK7kLEwMTV329GHtNkTIKJ720U-bW7Q1n5piWFByYxjIEiCU";
const _U = "1jN683a3fhzhbvuZLl-tZOylU3ovkJ7-WUC96Lef3dKvyfqano3tQeNGKqZQoFmkiBYnPqHANCshNaq-C0gQcO6J1YXR9vDzwPsNSH5If7DxWExFgeAaOEKVw93TmbOPwh1oJeMhw7p3yAWOfF-i1SklqJ5D8-0CeFT_TvuMTY_R_20MkJUwliTLhKjofK7kLEwMTV329GHtNkTIKJ720U-bW7Q1n5piWFByYxjIEiCU";
module.exports = {
  config: {
    name: "dalle",
    aliases: ["dalle3"],
    version: "1.0.2",
    author: "SiamXaminul ",
    role: 2,
    countDown: 5,
    shortDescription: {
      en: "dalle"
    },
    longDescription: {
      en: ""
    },
    category: "dalle",
    guide: {
      en: "{prefix}dalle <search query> -<number of images>"
    }
  },

  onStart: async function ({ api, event, args }) {

const uid = event.senderID
    const permission = [`${uid}`];
    if (!permission.includes(event.senderID)) {
      api.sendMessage(
        "You don't have enough permission to use this command. Only admin can do it.",
        event.threadID,
        event.messageID
      );
      return;
    }

    const keySearch = args.join(" ");
    const indexOfHyphen = keySearch.indexOf('-');
    const keySearchs = indexOfHyphen !== -1 ? keySearch.substr(0, indexOfHyphen).trim() : keySearch.trim();
    const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 4;

    try {
      const res = await axios.get(`https://api-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(keySearchs)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("No images found for the provided query.", event.threadID, event.messageID);
        return;
      }

      const imgData = [];
      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
        body: `Here's your generated image🐸`
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("cookie of the command. Is expired", event.threadID, event.messageID);
    } finally {
      await fs.remove(path.join(__dirname, 'cache'));
    }
  }
};
