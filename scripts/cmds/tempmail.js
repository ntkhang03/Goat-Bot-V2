const axios = require('axios');
module.exports = {
  config: {
    name: "tempmail",
    version: "1.0",
    role: 0,
    countdown: 5,
    author: "Rehat86 | @Turtle APIs",
    longDescription: "Create temporary email and check inbox messages",
    category: "media",
  },

  onStart: async ({ api, event, args }) => {
    try {
      if (!args[0]) {
        return api.sendMessage("❌ Please specify 'inbox' or 'create' as the first argument.", event.threadID);
      }

      const command = args[0].toLowerCase();

      if (command === 'inbox') {
        const emailAddress = args[1];
        if (!emailAddress) {
          return api.sendMessage("Please provide an email address for the inbox.", event.threadID, event.messageID);
        }

        const inboxResponse = await axios.get(`https://api-turtle.onrender.com/api/mail/${emailAddress}`);
        const messages = inboxResponse.data;

        if (!messages || messages.length === 0) {
          return api.sendMessage(`No messages found for ${emailAddress}.`, event.threadID, event.messageID);
        }

        let messageText = '📬 Inbox Messages: 📬\n\n';
        for (const message of messages) {
          messageText += `📧 Sender: ${message.from}\n`;
          messageText += `📑 Subject: ${message.subject || 'Empty'}\n`;
          messageText += `📩 Message: ${message.body}\n`;
        }

        api.sendMessage(messageText, event.threadID);
      } else if (command === 'create') {
        const tempMailResponse = await axios.get("https://api-turtle.onrender.com/api/mail/create");
        const tempMailData = tempMailResponse.data;

        if (!tempMailData.email) {
          return api.sendMessage("Failed to generate temporary email.", event.threadID, event.messageID);
        }

        api.sendMessage(`📩 𝖧𝖤𝖱𝖤 𝖸𝖮𝖴𝖱 𝖦𝖤𝖭𝖤𝖱𝖠𝖳𝖤𝖣 𝖳𝖤𝖬𝖯𝖬𝖠𝖨𝖫 𝖥𝖱𝖮𝖬 𝖠𝖭𝖲𝖤𝖫\n 𝖤𝖬𝖠𝖨𝖫➪: ${tempMailData.email}`, event.threadID, event.messageID);
      } else {
        return api.sendMessage("Please specify 'inbox' or 'create'.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage("An error occurred.", event.threadID, event.messageID);
    }
  }
};￼Enter
