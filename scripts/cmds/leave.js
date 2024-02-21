const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
module.exports = {
  config: {
    name: "leave",
    aliases: ["l"],
    version: "1.0",
    author: "Itachi",
    countDown: 5,
    role: 2,
    shortDescription: "bot will leave gc",
    longDescription: "",
    category: "admin",
    guide: {
      vi: "{pn} [tid,blank]",
      en: "{pn} [tid,blank]"
    }
  },

  onStart: async function ({ api,event,args, message }) {
 var id;
 if (!args.join(" ")) {
 id = event.threadID;
 } else {
 id = parseInt(args.join(" "));
 }
 return api.sendMessage('𝙈𝙮 𝙇𝙤𝙧𝙙, 𝐈𝐦 𝐋𝐞𝐚𝐯𝐢𝐧𝐠 𝐈𝐧 𝐓𝐡𝐢𝐬 𝐆𝐫𝐨𝐮𝐩, 𝐓𝐡𝐚𝐧𝐤𝐲𝐨𝐮 𝐅𝐨𝐫 𝐔𝐬𝐢𝐧𝐠 𝐌𝐞! 𝐇𝐨𝐩𝐞 𝐘𝐨𝐮 𝐇𝐚𝐝 𝐀 𝐆𝐫𝐞𝐚𝐭 𝐓𝐢𝐦𝐞 😙', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
    }
  };
