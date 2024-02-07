const axios = require('axios');

module.exports = {
  config: {
    name: "define",
    version: "1.0",
    author: "kshitiz",
    countDown: 5,
    role: 0,
    shortDescription: "",
    longDescription: "Retrieve definitions and meanings of English words",
    category: "𝗜𝗡𝗙𝗢",
    guide: "{pn}define [word]"
  },
  onStart: async function ({ api, event, args }) {
    if (args.length < 1) {
      return api.sendMessage("Please provide a word to look up.", event.threadID, event.messageID);
    }

    const word = args[0];

    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`); // Use 'en_US' for American English

      if (response.data && response.data.length > 0) {
        const entry = response.data[0];

        const meanings = entry.meanings.map((meaning) => {
          const partOfSpeech = meaning.partOfSpeech;
          const definitions = meaning.definitions.map((definition) => `  ⌲ ${definition.definition}`).join("\n");
          return `  ❑ ${partOfSpeech}\n${definitions}`;
        }).join("\n\n");

        let message = `𝗪𝗢𝗥𝗗: ${entry.word}\n`;

        if (entry.phonetics && entry.phonetics.length > 0) {
          message += `𝗣𝗛𝗢𝗡𝗘𝗧𝗜𝗖: ${entry.phonetics[0].text}\n`;
          if (entry.phonetics[0].audio) {
            message += `𝗔𝗨𝗗𝗜𝗢: ${entry.phonetics[0].audio}\n`;
          }
        }

        if (entry.origin) {
          message += `𝗢𝗥𝗜𝗚𝗜𝗡: ${entry.origin}\n`;
        }

        if (meanings) {
          message += `\n𝗠𝗘𝗔𝗡𝗜𝗡𝗚𝗦\n${meanings}`;
        } else {
          message += "No meanings found.";
        }

        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage("Word not found or an error occurred.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while fetching the definition.", event.threadID, event.messageID);
    }
  }
};
