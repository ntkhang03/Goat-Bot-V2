const axios = require('axios');
module.exports = {
  config: {
    name: "age",
    version: "1.0",
    author: "Samir Œ | Ntkhang",
    countDown: 5,
    role: 0,
    shortDescription: "Calculate age from the provided date",
    longDescription: "Calculate age from the provided date",
    category: "utility",
    guide: "{pn} <day> | <month> | <year>"
  },

  onStart: async function ({ message, args }) {
    const input = args.join(" ");
    const [day, month, year] = input.split("|").map(part => part.trim());

    if (!day || !month || !year) {
      return message.reply("Please provide a valid date in the format: day | month | year");
    }

    message.reply("Calculating age... Please wait.", async (err, info) => {
      try {
        const providedUrl = `https://api-samir.onrender.com/age/${day}/${month}/${year}`;
        const response = {
          attachment: await global.utils.getStreamFromURL(providedUrl),
        };
        message.unsend(info.messageID);
        message.reply(response);
      } catch (error) {
        console.error(error);
        message.reply(`Error: ${error}`);
      }
    });
  }
};

//Thank ntkhang for the api