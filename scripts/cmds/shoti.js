const axios = require('axios');
const request = require('request');
const fs = require("fs");


module.exports = {
config: {
  name: "shoti",
  version: "1.0",
  author: "ralph/zed",//goatbot convert
  countDown: 20,
  category: "media",
},

langs: {
  vi: {},
  en: {},
},
  
  onStart: async function ({ api, event }) {
  
  api.sendMessage(`⏱️ | Video is sending please wait.`, event.threadID, event.messageID);
axios.get('https://apivideo.saikidesu-support.repl.co/tiktok?apikey=opa').then(res => {
  let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
  let callback = function () {
          api.sendMessage({
                                                body: `Shoti Viet Version 🤍`,
            attachment: fs.createReadStream(__dirname + `/cache/shoti.${ext}`)
          }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/shoti.${ext}`), event.messageID);
        };
        request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/shoti.${ext}`)).on("close", callback);
      }) .catch(err => {
                     api.sendMessage("api error status: 200", event.threadID, event.messageID);
    api.setMessageReaction("😢", event.messageID, (err) => {}, true);
                  })     
},
};
