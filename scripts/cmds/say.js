const { utils } = global;
const axios = require('axios');

module.exports = {
 config: {
 name: "say",
 aliases: ["voice"],
 version: "1.0",
 author: "Xemon",
 countDown: 5,
 role: 0,
 shortDescription: "convert text into voice even emoji's are supported",
 longDescription: "",
 category: "𝗙𝗨𝗡",
 guide: {
      vi: "{pn} text",
      en: "{pn} text"
    }
 },
 onStart: async function ({ message, api, event, args }) {
  try {
    const { createReadStream, unlinkSync } = require("fs-extra");
    const { resolve } = require("path");
    var content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
    var languageToSay = (["ru","en","ko","ja"].some(item => content.indexOf(item) == 0)) ? content.slice(0, content.indexOf(" ")) : global.GoatBot.config.language;
    var msg = (languageToSay != global.GoatBot.config.language) ? content.slice(3, content.length) : content;
    const path = resolve(__dirname, 'assets', `${event.threadID}_${event.senderID}.mp3`);
    await global.utils.downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`, path);
    return api.sendMessage({ attachment: createReadStream(path)}, event.threadID, () => unlinkSync(path));
  } catch (e) { return console.log(e) };
}
};
