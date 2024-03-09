module.exports = {
  config: {
    name: "edit",
    version: "1.0",
    author: "Kshitiz",
    role: 0,
    shortDescription: "Edit a bot's message",
    longDescription: "Edit a bot's message ",
    category: "tools",
    guide: {
      en: "reply bot msg",
    },
  },

  onStart: async function ({ api, event }) {
    
  },

  onChat: async function ({ api, event, message }) {
    const targetUserId = "100056927749389";// add your uid

   
    if (event.senderID.toString() === targetUserId && event.type === "message_reply") {
      const editedMessage = event.body;

      try {
       
        await api.editMessage(editedMessage, event.messageReply.messageID);
      } catch (error) {
        console.error("", error);
        api.sendMessage("", event.threadID);
      }
    }
  },
};
