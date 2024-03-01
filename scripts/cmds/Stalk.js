const axios = require('axios');

module.exports = {
  config: {
    name: "stalk",
    aliases: ["st"],
    version: "1.0",
    author: "Aminulsordar",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get some basic information about a user."
    },
    longDescription: {
      en: "Get some basic information about a user"
    },
    category: "media",
    guide: {
      en: "{pn} [ blank | reply | uid | mention ]"
    }
  },
  onStart: async function ({ api, event, args }) {
    try {
      const { messageReply, senderID, threadID, type, mentions } = event;
      let uid;
      if (args.length > 0) {
        uid = args[0];
      } else if (type === "message_reply") {
        uid = messageReply.senderID;
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else {
        uid = event.senderID;
      }
      let data = await api.getUserInfo(uid);
      let { profileUrl, name, gender } = data[uid];
      let genderText = "";

      if (gender === 1) {
        genderText = "Female";
      } else if (gender === 2) {
        genderText = "Male";
      } else {
        genderText = "Gae";
      }

      const profilePic = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const message = {
        body: `❏Name: ${name}\n❏Gender: ${genderText}\n❏UID: ${uid}\n❏Profile URL: ${profileUrl}\n❏Profile Picture:`,
        attachment: await global.utils.getStreamFromURL(profilePic)
      };

      return api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("Something went wrong, try again later..", event.threadID, event.messageID);
    }
  }
};
