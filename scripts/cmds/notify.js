
const axios = require("axios");

module.exports = {
  config: {
    name: "notify",
    aliases: [],
    version: "1.0",
    author: "Kshitiz",
    countDown: 5,
    role: 2,
    shortDescription: "Send a notification to a group chat",
    longDescription: "",
    category: "custom",
    guide: {
      en: "{pn} <message> [gcUid]",
    },
  },

  onStart: async function ({ api, event, args, message }) {
    if (!args[0]) {
   
      try {
        const groupList = await api.getThreadList(100, null, ['INBOX']);
        const filteredList = groupList.filter(group => group.threadName !== null);

        if (filteredList.length === 0) {
          await api.sendMessage('No group chats found.', event.threadID);
        } else {
          const formattedList = filteredList.map((group, index) =>
            `│${index + 1}. ${group.threadName}\n│𝐓𝐈𝐃: ${group.threadID}`
          );
          const message = `╭─╮\n│𝐋𝐢𝐬𝐭 𝐨𝐟 𝐠𝐫𝐨𝐮𝐩 𝐜𝐡𝐚𝐭𝐬:\n${formattedList.map(line => `${line}`).join("\n")}\n╰───────────⨠`;
          await api.sendMessage(message, event.threadID, event.messageID);
        }
      } catch (error) {
        console.error("Error listing group chats", error);
      }
      return;
    }

    const messageText = args.slice(0, -1).join(" ");

    try {
    
      const repliedAttachment = event.messageReply && event.messageReply.attachments.length > 0
        ? await global.utils.getStreamFromURL(event.messageReply.attachments[0].url)
        : null;

   
      const notificationMessage = `${messageText}`;

      const gcUid = args.length >= 2 ? args[args.length - 1] : null;
      const groupChats = gcUid ? [gcUid] : (await api.getThreadList(100, null, ["INBOX"])).map(group => group.threadID);

      for (const groupChat of groupChats) {
        if (repliedAttachment) {
          
          await api.sendMessage({
            attachment: repliedAttachment,
            body: notificationMessage
          }, groupChat);
        } else {
         
          await api.sendMessage({ body: notificationMessage }, groupChat);
        }
      }

      api.sendMessage(`Notification sent to ${gcUid ? "group chat " + gcUid : "all group chats"}`, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(`use the format noti <message> GcUid (tid). to send notification to that gc `, event.threadID, event.messageID);
      console.error(error);
    }
  },
};
