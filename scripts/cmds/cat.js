const axios = require('axios');

module.exports = {
  config: {
    name: 'cat',
    aliases: ['catfact'],
    version: '1.1',
    author: 'JV',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: 'Sends a random cat image with a fact.'
    },
    longDescription: {
      en: 'Sends a random cat image fetched from the CatAPI along with an interesting cat fact.'
    },
    guide: {
      en: '{pn}'
    }
  },
  onStart: async function ({ api, event }) {
    try {
      const [imageResponse, factResponse] = await Promise.all([
        axios.get('https://api.thecatapi.com/v1/images/search'),
        axios.get('https://catfact.ninja/facts')
      ]);

      if (imageResponse.status !== 200 || !imageResponse.data || !imageResponse.data[0] || !imageResponse.data[0].url) {
        throw new Error('Invalid or missing response from CatAPI');
      }

      if (factResponse.status !== 200 || !factResponse.data || !factResponse.data.data || factResponse.data.data.length === 0) {
        throw new Error('Invalid or missing cat facts');
      }

      const imageURL = imageResponse.data[0].url;
      const facts = factResponse.data.data;

      const randomFactIndex = Math.floor(Math.random() * facts.length);
      const factText = facts[randomFactIndex].fact;

      const stream = await global.utils.getStreamFromURL(imageURL);

      if (!stream) {
        throw new Error('Failed to fetch image from URL');
      }

      const messageID = await api.sendMessage({
        body: factText,
        attachment: stream
      }, event.threadID);

      if (!messageID) {
        throw new Error('Failed to send message with attachment');
      }

      console.log(`Sent cat image with message ID ${messageID}`);
    } catch (error) {
      console.error(`Failed to send cat image: ${error.message}`);
      api.sendMessage('Sorry, something went wrong while trying to send a cat image. Please try again later.', event.threadID);
    }
  }
};