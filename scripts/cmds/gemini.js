const axios = require('axios');
const Data = {};

module.exports = {
  config: {
    name: "gemini",
    version: 2.0,
    author: "OtinXSandip",
    longDescription: "Google ai ",
    category: "ai",
    guide: {
      en: "{p}{n} questions",
    },
  },
  onStart: async function ({ args, message, event, Reply, api }) {
    try {
      if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments[0].type === "photo") {
        const photoUrl = encodeURIComponent(event.messageReply.attachments[0].url);
        const lado = args.join(" ");
        const aalu = "otinxsandeep";
        const url = `https://sdxl.${aalu}.repl.co/gemini2?prompt=${encodeURIComponent(lado)}&url=${photoUrl}`;
        const response = await axios.get(url);

        message.reply(response.data.answer);
        return;
      }

      const prompt = args.join(' ');
      const chat = event.senderID;

      if (prompt.toLowerCase() === "clear") {
        delete Data[chat];
        message.reply('Done ✅');
        return;
      }

      if (!Data[chat]) {
        Data[chat] = prompt;
      } else {
        Data[chat] += '\n' + prompt;
      }

      const ass = "otinxsandeep";
      const encodedPrompt = encodeURIComponent(Data[chat]);

      if (!encodedPrompt) {
        return message.reply("Please provide questions");
      }

      const response = await axios.get(`https://sdxl.${ass}.repl.co/gemini?prompt=${encodedPrompt}`);
      const answer = response.data.answer;

      message.reply({
        body: `${answer}

You can reply for continue chatting 🫥`,
      }, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  },
  onReply: async function ({ args, message, event, Reply, api }) {
    try {
      const prompt = args.join(' ');
      const chat = event.senderID;

      if (prompt.toLowerCase() === "clear") {
        delete Data[chat];
        message.reply('Done ✅');
        return;
      }

      if (!Data[chat]) {
        Data[chat] = prompt;
      } else {
        Data[chat] += '\n' + prompt;
      }

      const ass = "otinxsandeep";
      const encodedPrompt = encodeURIComponent(Data[chat]);

      const response = await axios.get(`https://sdxl.${ass}.repl.co/gemini?prompt=${encodedPrompt}`);
      const answer = response.data.answer;

      message.reply({
        body: `${answer}

you can reply for continue chatting 🫥`,
      }, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
