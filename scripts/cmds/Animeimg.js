const axios = require('axios');

module.exports = {
  config: {
    name: 'animeimg',
    version: '1.0',
    author: 'kshitiz',
    role: 0,
    category: 'funny',
    shortDescription: {
      en: 'Sends a random anime-style image.'
    },
    longDescription: {
      en: 'Sends a random anime-style image fetched from the API.'
    }
  },
  onStart: async function ({ api, event }) {
    try {
      const url = 'https://any-anime.p.rapidapi.com/anime/img';
      const headers = {
        'X-RapidAPI-Key': 'b38444b5b7mshc6ce6bcd5c9e446p154fa1jsn7bbcfb025b3b',
        'X-RapidAPI-Host': 'any-anime.p.rapidapi.com'
      };

      const response = await axios.get(url, { headers });

      if (response.status === 200 && response.data) {
        const imageURL = response.data.url;
        const imageStream = await global.utils.getStreamFromURL(imageURL);

        if (imageStream) {
          const messageID = await api.sendMessage({
            body: 'Here is a random anime-style image:',
            attachment: imageStream
          }, event.threadID);

          if (messageID) {
            console.log(`Sent random anime-style image with message ID ${messageID}`);
          } else {
            console.error('Failed to send message with anime-style image');
          }
        } else {
          throw new Error('Failed to fetch the image stream from the URL');
        }
      } else {
        throw new Error('Failed to fetch data from the API');
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      api.sendMessage('Sorry, something went wrong while trying to send an anime-style image. Please try again later.', event.threadID);
    }
  }
};
