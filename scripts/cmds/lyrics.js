module.exports = {
  config: { name: 'lyrics', author: 'Jun', countDown: 5, role: 0, category: 'media', shortDescription: { en: 'sends lyrics to chat' } },
  onStart: async function({ api, event, args }) {
    try {
      const axios = require("axios");
      const title = args.join(" ");
      if (!title) {
        api.sendMessage('Please provide a song name.', event.threadID, event.messageID);
        return;
      }
      const res = await axios.get(`https://api-test.yourboss12.repl.co/api/lyrics?title=${title}`);
      const { songTitle, artist, lyrics, image } = res.data;
      const attachment = [await global.utils.getStreamFromURL(image)];
      const message = `title: ${title}\nartist: ${artist}\n\n\n${lyrics}`;
      api.setMessageReaction("🎧", event.messageID, event.messageID, api); 
      api.sendMessage('searching for lyrics, please wait...', event.threadID, event.messageID); 
      api.sendMessage({ attachment, body: message }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage('Error occurred.', event.threadID, event.messageID);
    }
  }
};
