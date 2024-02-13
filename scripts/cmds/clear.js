module.exports = {
  config: {
    name: "clear",
    aliases: ['cl'],
    author: "kshitiz & SKY", // modify by SKY
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "Unsend messages sent by bot"
    },
    category: "boxchat",
    guide: {
      en: "{p}{n} [number]"
    }
  },
  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;
    
    // Default to 50 messages if no argument is provided
    const numMessages = args[0] ? parseInt(args[0]) : 50;

    const unsendBotMessages = async () => {
      try {
        const botMessages = await api.getThreadHistory(threadID, numMessages);

        const botSentMessages = botMessages.filter(message => message.senderID === api.getCurrentUserID());

        for (const message of botSentMessages) {
          await api.unsendMessage(message.messageID);
        }
      } catch (error) {
        console.error("Error occurred while unsending messages:", error);
      }
    };

    await unsendBotMessages();
  }
};