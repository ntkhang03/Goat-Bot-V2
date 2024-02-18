const axios = require('axios');
const srod = require('srod-v2');

module.exports = {
  config: {
    name: 'advice',
    version: '1.0',
    author: 'OtinXSandip',
    countDown: 5,
    role: 0,
    shortDescription: '',
    longDescription: {
      en: 'Get a random advice.',
    },
    category: 'study',
    guide: {
      en: '{prefix} <>',
    },
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const adviceResult = await srod.GetAdvice();
      const advice = adviceResult.embed.description;

      let translatedAdvice = await translateAdvice(advice);

      let messageToSend = `: ${translatedAdvice}`;

      return api.sendMessage(messageToSend, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
    }
  },
};

