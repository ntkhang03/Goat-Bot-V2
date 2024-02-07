const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: 'programmingmeme',
    aliases: ['pmeme'],
    version: '1.0',
    author: 'Kshitiz',
    role: 0,
    category: 'meme',
    shortDescription: {
      en: 'Sends a random programming meme.'
    },
    longDescription: {
      en: 'Sends a random programming meme .'
    },
    guide: {
      en: '{pn} programmingmeme'
    }
  },
  onStart: async function ({ api, event }) {
    try {
      const response = await axios.get('https://memes-n5hp.onrender.com/meme');

      if (response.status !== 200 || !response.data || !response.data.imageUrl) {
        throw new Error('Invalid or missing response from the API');
      }

      const imageUrl = response.data.imageUrl;

    
      const filePath = path.join(__dirname, `/cache/${Date.now()}.jpg`);

     
      const writer = fs.createWriteStream(filePath);
      const responseStream = await axios.get(imageUrl, { responseType: 'stream' });

      responseStream.data.pipe(writer);

  
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

     
      const messageID = await api.sendMessage({
        body: '',
        attachment: fs.createReadStream(filePath)
      }, event.threadID, event.messageID);

      if (!messageID) {
        throw new Error('Failed to send message with attachment');
      }

      console.log(`Sent programming meme  ${messageID}`);
    } catch (error) {
      console.error(`Failed to send programming meme: ${error.message}`);
      api.sendMessage('Sorry, something went wrong.Please try again later.', event.threadID);
    }
  }
};
