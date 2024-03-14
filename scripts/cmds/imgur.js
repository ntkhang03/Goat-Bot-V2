const axios = require('axios');

module.exports = {
  config: {
    name: "imgur",
    version: "1.0",
    author: "otinxsandip",
    countDown: 1,
    role: 0,
    longDescription: "Imgur link",
    category: "utility",
    guide: {
      en: "${pn} reply to image"
    }
  },

  onStart: async function ({ message, api, event }) {  

    const puti = event.messageReply?.attachments[0]?.url;

    if (!puti) {
      return message.reply('Please reply to an image.');
    }

    try {
      const res = await axios.get(`https://sandipapi.onrender.com/imgur?link=${encodeURIComponent(puti)}`);
      const lado = res.data.uploaded.image;
      return message.reply(lado);
    } catch (error) {
      console.error(error);
      return message.reply('api sucks bro.');
    }
  }
};
