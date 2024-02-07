const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "tinyurl",
    version: "1.0",
    author: "Kshitiz",
    description: "Shorten URLs using TinyURL",
    usage: "{p}tinyurl(replied).",
    category: "Utility",
    role: 0,
  },

  onStart: async function ({ message, event, api }) {
    if (event.type !== "message_reply" || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return api.sendMessage({ body: "❌ | Please reply to an attachment." }, event.threadID, event.messageID);
    }

    const attachment = event.messageReply.attachments[0];

    try {
      const shortUrl = await tinyurl.shorten(attachment.url);
      api.sendMessage({ body: `${shortUrl}` }, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage({ body: "❌ | Error occurred while shortening URL." }, event.threadID, event.messageID);
      console.error(error);
    }
  }
};
