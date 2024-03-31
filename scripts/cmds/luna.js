 const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "lunagc",
    aliases: ["lunagc"],
    version: "1.0",
    author: "AceGun",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "add user in thread"
    },
    longDescription: {
      vi: "",
      en: "add any user to bot owner group chat"
    },
    category: "chat box",
    guide: {
      en: "{pn}sandrinagc"
    }
  },

  onStart: async function ({ api, event, args }) {
    const threadID = "7787797321239332";

    try {
      // Check if the user is already in the group chat
      const threadInfo = await api.getThreadInfo(threadID);
      const participants = threadInfo.participantIDs;

      if (participants.includes(event.senderID)) {
        api.sendMessage("⚠ | 🎯Vous Êtes déjà dans mon groupe 💌.", event.threadID);

        // Set ⚠ reaction for already added user
        api.setMessageReaction("⚠", event.messageID, "👍", api);
      } else {
        // If not, add the user to the group chat
        await api.addUserToGroup(event.senderID, threadID);
        api.sendMessage("✅ | 🎯tu es déjà dans le groupe, si tu ne le retrouve pas recherche dans ta boite de spam", event.threadID);

        // Set ✅ reaction for successfully added user
        api.setMessageReaction("✅", event.messageID, "👍", api);
      }
    } catch (error) {
      api.sendMessage("❌ | 🎯 une erreur c'est produite veillez réessayer plus tard😴", event.threadID);

      // Set ❌ reaction for failed adding user
      api.setMessageReaction("❌", event.messageID, "👍", api);

    }
  }
};
