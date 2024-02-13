 module.exports = {
  config: {
    name: "kera",
    version: "1.0",
    author: "SKY",
    countDown: 5,
    role: 2,
    shortDescription: "no prefix",
    longDescription: "no prefix",
    category: "fun",
  },
  onStart: async function () {},
  onChat: async function ({ event, api, getLang }) {
    // Check if the message body is exactly "kera"
    if (event.body && event.body.toLowerCase() === "kera") {
      // Leave the group if the exact phrase is detected
      const threadID = event.threadID;
      api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    }
  },
};