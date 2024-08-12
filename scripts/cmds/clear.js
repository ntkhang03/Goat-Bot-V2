const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "clean",
    aliases: [],//["c"] add aliases like that 
    author: "kshitiz",  
    version: "2.0",
    cooldowns: 5,
    role: 2,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "help to clean cache and tmp folder"
    },
    category: "𝗢𝗪𝗡𝗘𝗥",
    guide: {
      en: "{p}{n}"
    }
  },
  onStart: async function ({ api, event }) {
    const cacheFolderPath = path.join(__dirname, 'cache');
    const tmpFolderPath = path.join(__dirname, 'tmp');


    api.sendMessage({ body: 'Cleaning cache and tmp folders...', attachment: null }, event.threadID, () => {

      const cleanFolder = (folderPath) => {

        if (fs.existsSync(folderPath)) {

          const files = fs.readdirSync(folderPath);

          if (files.length > 0) {

            files.forEach(file => {
              const filePath = path.join(folderPath, file);

              fs.unlinkSync(filePath);
              console.log(`File ${file} deleted successfully from ${folderPath}!`);
            });

            console.log(`All files in the ${folderPath} folder deleted successfully!`);
          } else {
            console.log(`${folderPath} folder is empty.`);
          }
        } else {
          console.log(`${folderPath} folder not found.`);
        }
      };


      cleanFolder(cacheFolderPath);


      cleanFolder(tmpFolderPath);


      api.sendMessage({ body: 'Cache and tmp folders cleaned successfully!' }, event.threadID);
    });
  },
};
