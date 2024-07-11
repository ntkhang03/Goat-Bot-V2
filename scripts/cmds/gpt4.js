const {get} = require("axios"),
    url = "http://eu4.diresnode.com:3301";

module.exports = {
  config: {
    name: "gpt4",
    aliases: ["openai4"],
    version: "1.0.0",
    author: "Deku",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Talk to GPT 4 (continues conversation)",
    },
    longDescription: {
      en: "Talk to GPT 4 (continues conversation)",
    },
    category: "AI",
    guide: {
      en: "gpt4 <ask> or gpt4 <clear> to reset conversation."
    },
  },

  onStart: async function ({ api, event, args }) {
    try {
     let prompt = args.join(' '), id = event.senderID;
           async function r(msg){
                 api.sendMessage(msg, event.threadID, event.messageID)
             }
            if(!prompt) return r("Missing input!\n\nIf you want to reset the conversation with "+this.config.name+" you can use “"+this.config.name+" clear”");
            r("🔍…");
            const res = await get(url+"/gpt4?prompt="+prompt+"&idd="+id);
                return r(res.data.gpt4);
       } catch (error) {
      console.error("Error occurred during TTS:", error);
      return api.sendMessage(error.message, event.threadID, event.messageID)
     }
   }
};