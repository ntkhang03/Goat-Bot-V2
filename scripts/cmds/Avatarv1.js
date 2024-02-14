const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "avatarv1",
    version: "2.0",
    author: "kshitiz",
    countDown: 5,
    role: 0,
    shortDescription: "",
    longDescription: {
      en: ""
    },
    category: "info",
    guide: {
      en: "{pn} avatar ID|TEXT|TEX"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID, senderID, body } = event;
    const content = args.join(" ").split("|").map(item => item.trim());
    let text1 = encodeURI(content[2]);
    let text = encodeURI(content[1]);
    let num = parseInt(content[0]);

   
    if (!text || !text1 || !num || isNaN(num)) {
      return api.sendMessage("[!] Invalid input. Please provide a valid ID and text.", event.threadID, event.messageID);
    }

    if (num > 882) {
      return api.sendMessage("[!] Maximum ID is 882 only.", event.threadID, event.messageID);
    }

    api.sendMessage("[!] PROCESSING PLEASE WAIT..", event.threadID, event.messageID);

  
    var callback = () => {
      api.sendMessage({ body: "", attachment: fs.createReadStream(__dirname + "/cache/avt1.png") }, event.threadID, () => {
        
        fs.unlinkSync(__dirname + "/cache/avt1.png");
      }, event.messageID);
    };

   
    return axios
      .get(`https://sakibin.sinha-apiv2.repl.co/taoanhdep/avatarwibu?id=${num}&chu_nen=${text1}&chu_ky=${text}`, {
        responseType: "stream"
      })
      .then(response => {
      
        response.data.pipe(fs.createWriteStream(__dirname + '/cache/avt1.png'))
          .on('close', () => callback());
      })
      .catch(error => {
        console.error("Error fetching image:", error);
        api.sendMessage("[!] An error occurred while processing the request.", event.threadID, event.messageID);
      });
  }
};
