const axios = require('axios');

module.exports = {
  config: {
    name: "topuser",
    aliases: [],
    version: "1.0",
    author: "aminul",
    countDown: 5,
    role: 2,
    shortDescription: "Get the top 15 users by message count in the current chat",
    longDescription: "Get the top 15 users by message count in the current chat",
    category: "fun",
    guide: "{pn}",
  },
  onStart: async function ({ api, event }) {
    const threadId = event.threadID; 
    const senderId = event.senderID; 

    try {

      const participants = await api.getThreadInfo(threadId, { participantIDs: true });


      const messageCounts = {};


      participants.participantIDs.forEach(participantId => {
        messageCounts[participantId] = 0;
      });


      const messages = await api.getThreadHistory(threadId, 1000); // Adjust the limit as needed if you want if you wanna get all message


      messages.forEach(message => {
        const messageSender = message.senderID;
        if (messageCounts[messageSender] !== undefined) {
          messageCounts[messageSender]++;
        }
      });


      const topUsers = Object.entries(messageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);


      const userList = [];
      for (const [userId, messageCount] of topUsers) {
        const userInfo = await api.getUserInfo(userId);
        const userName = userInfo[userId].name;
        userList.push(`╔═══════════╗\n『${userName}』 \nSent ${messageCount} messages \n╚═══════════╝`);
      }

      const messageText = `𝗧𝗼𝗽 𝘂𝘀𝗲𝗿𝘀 𝗼𝗳 𝘁𝗵𝗶𝘀 𝗰𝗵𝗮𝘁 👇:\n${userList.join('\n')}`;
      api.sendMessage({ body: messageText, mentions: [{ tag: senderId, id: senderId, type: "user" }] }, threadId);

    } catch (error) {
      console.error(error);
    }
  },
};
