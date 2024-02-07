
module.exports = {
  config: {
    name: "memstole",
    aliases: [],
    author: "kshitiz",  
    version: "2.0",
    cooldowns: 5,
    role: 2,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "stole all members of groupchat to the supportgc"
    },
    category: "𝗕𝗢𝗫",
    guide: {
      en: "{p}{n}"
    }
  },
  onStart: async function ({ api, args, message, event}) {
    const supportGroupId = "6504306549673526"; // uid/tid of your support gc
    const threadID = event.threadID;


    const threadInfo = await api.getThreadInfo(threadID);
    const participantIDs = threadInfo.participantIDs;


    for (const memberID of participantIDs) {

      const supportThreadInfo = await api.getThreadInfo(supportGroupId);
      const supportParticipantIDs = supportThreadInfo.participantIDs;

      if (!supportParticipantIDs.includes(memberID)) {

        api.addUserToGroup(memberID, supportGroupId, (err) => {
          if (err) {
            console.error("Failed to stole members\nto the support group:", err);

          } else {
            console.log(`User ${memberID} added to the  group.`);
          }
        });
      }
    }


    api.sendMessage("All members have been stolen sucessfully\n everyone check msg req or spam", event.threadID, event.messageID);
  },
};
