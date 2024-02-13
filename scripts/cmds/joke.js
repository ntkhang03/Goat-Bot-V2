const axios = require('axios');

module.exports = {
  config: {
    name: 'joke',
    version: '1.0',
    author: 'JV',
    role: 0,
    category: 'fun',
    shortDescription: {
      en: 'Tells a random joke.'
    },
    longDescription: {
      en: 'Tells a random joke fetched from the JokeAPI.'
    },
    guide: {
      en: '{pn}'
    }
  },
  onStart: async function ({ api, event }) {
    try {
      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');

      if (response.status !== 200 || !response.data || !response.data.setup || !response.data.punchline) {
        throw new Error('Invalid or missing response from JokeAPI');
      }

      const setup = response.data.setup;
      const punchline = response.data.punchline;

      const message = `Here's a joke for you: \n\n${setup}\n\n${punchline}`;

      const messageID = await api.sendMessage(message, event.threadID);

      if (!messageID) {
        throw new Error('Failed to send message with joke');
      }

      console.log(`Sent joke with message ID ${messageID}`);
    } catch (error) {
      console.error(`Failed to send joke: ${error.message}`);
      api.sendMessage('Sorry, something went wrong while trying to tell a joke. Please try again later.', event.threadID);
    }
  }
};