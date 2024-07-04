module.exports = {
  config: {
    name: "antiout",
    version: "1.0",
    author: "AceGun",
    countDown: 5,
    role: 0,
    shortDescription: "Enable or disable antiout",
    longDescription: "",
    category: "boxchat",
    guide: "{pn} {{[on | off]}}",
    envConfig: {
      deltaNext: 5
    }
  },
  onStart: async function({ message, event, threadsData, args }) {
    let antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout === undefined) {
      await threadsData.set(event.threadID, true, "settings.antiout");
      antiout = true;
    }
    if (!["on", "off"].includes(args[0])) {
      return message.reply("Please use 'on' or 'off' as an argument");
    }
    await threadsData.set(event.threadID, args[0] === "on", "settings.antiout");
    return message.reply(`Antiout has been ${args[0] === "on" ? "enabled" : "disabled"}.`);
  },
  onEvent: async function({ api, event, threadsData }) {
    const antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout && event.logMessageData && event.logMessageData.leftParticipantFbId) {
      // A user has left the chat, get their user ID
      const userId = event.logMessageData.leftParticipantFbId;

      // Check if the user is still in the chat
      const threadInfo = await api.getThreadInfo(event.threadID);
      const userIndex = threadInfo.participantIDs.indexOf(userId);
      if (userIndex === -1) {
        // The user is not in the chat, add them back
        const addUser = await api.addUserToGroup(userId, event.threadID);
        if (addUser) {
          console.log(`User ${userId} was added back to the chat.`);
        } else {
          console.log(`Failed to add user ${userId} back to the chat.`);
        }
      }
    }
  }
};