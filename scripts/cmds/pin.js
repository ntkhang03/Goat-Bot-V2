const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pin",
    aliases: ["pin"],
    version: "1.0.2",
    author: "Kshitiz",
    role: 0,
    countDown: 40,
    shortDescription: {
      en: "Search images on Pinterest",
    },
    longDescription: {
      en: "get images from pinterest",
    },
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: {
      en: "{p}pin <search query> -<number of images>",
    },
  },

  onStart: async function ({ api, event, args, config }) {
    try {
      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) {
        return api.sendMessage(
          `Please enter the search query and the number of images ${config.guide.en}`,
          event.threadID,
          event.messageID
        );
      }
      const keySearchs = keySearch.substr(0, keySearch.indexOf("-")).trim();
      const numberSearch =
        parseInt(keySearch.split("-").pop().trim()) || 6;

      const apiUrl = `https://code-merge-api-hazeyy01.replit.app/pinterest/api?search=${encodeURIComponent(// api credit hazayy
        keySearchs
      )}`;

      const response = await axios.get(apiUrl);
      const data = response.data.data;

      if (data.length === 0) {
        return api.sendMessage(
          `No images found for "${keySearchs}"`,
          event.threadID,
          event.messageID
        );
      }

      const imgData = [];

      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
        const imgResponse = await axios.get(data[i], {
          responseType: "arraybuffer",
        });
        const imgPath = path.join(__dirname, "cache", `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage(
        {
          attachment: imgData,
          body: `Here are the top ${imgData.length} image results for "${keySearchs}":`,
        },
        event.threadID,
        event.messageID
      );

     
      await cleanFolder(path.join(__dirname, "cache"));

    } catch (error) {
      console.error(error);
      return api.sendMessage(
        `Error processing the request. Please try again.`,
        event.threadID,
        event.messageID
      );
    }
  },
};


async function cleanFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      await fs.unlink(filePath);
      console.log(`File ${file} deleted successfully from ${folderPath}!`);
    }

    console.log(`All files in the ${folderPath} folder deleted successfully!`);
  } catch (error) {
    console.error(`Error cleaning folder: ${error}`);
  }
}
