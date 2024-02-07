module.exports = {
  config: {
    name: "membercount",
    version: "1.0",
    author: "KSHITIZ",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "Đếm thành viên nhóm",
      en: "Count group members"
    },
    longDescription: {
      vi: "Xem số lượng thành viên trong nhóm",
      en: "View the number of members in the group"
    },
    category: "𝗕𝗢𝗫",
    guide: {
      vi: "   {pn}: dùng để xem số lượng thành viên trong nhóm",
      en: "   {pn}: used to view the number of members in the group"
    }
  },

  langs: {
    vi: {
      count: "Số lượng thành viên trong nhóm là:",
    },
    en: {
      count: "Number of members in the group:",
    }
  },

  onStart: async function ({ threadsData, message, event, api, commandName, getLang }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const { members } = threadData;

    if (members && members.length > 0) {
      const memberCount = members.length;
      message.reply(`${getLang("count")} ${memberCount}`);
    } else {
      message.reply(getLang("count") + " 0");
    }
  },

  onChat: async ({ threadsData, event }) => {
    const { senderID, threadID } = event;
    const members = await threadsData.get(threadID, "members");

    if (!members.some(member => member.userID === senderID)) {
      members.push({
        userID: senderID,
        name: await api.getProfile(senderID).name,
      });
    }

    await threadsData.set(threadID, members, "members");
  }
};
