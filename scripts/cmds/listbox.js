module.exports = {
  config: {
    name: "listbox",
    aliases: [],
    author: "kshitiz",
    version: "2.0",
    cooldowns: 5,
    role: 2,
    shortDescription: {
      en: "List all group chats the bot is in."
    },
    longDescription: {
      en: "Use this command to list all group chats the bot is currently in."
    },
    category: "owner",
    guide: {
      en: "{p}{n} "
    }
  },
  onStart: async function ({ api, event, args }) {
    try {
      if (args[0] === "leave" && args[1] === "all") {
        // Leave all group chats
        const groupList = await api.getThreadList(100, null, ['INBOX']);
        const filteredList = groupList.filter(group => group.threadName !== null);

        for (const group of filteredList) {
          await api.removeUserFromGroup(api.getCurrentUserID(), group.threadID);
          await api.sendMessage(`Bot has been removed from the group: ${group.threadName}`, event.threadID);
        }

        await api.sendMessage('Bot has left all group chats.', event.threadID);
      } else {
        const groupList = await api.getThreadList(100, null, ['INBOX']);
        const filteredList = groupList.filter(group => group.threadName !== null);

        if (filteredList.length === 0) {
          await api.sendMessage('No group chats found.', event.threadID);
        } else {
          const formattedList = filteredList.map((group, index) =>
            `│${index + 1}. ${group.threadName}\n│𝐓𝐈𝐃: ${group.threadID}`
          );
          const message = `╭─╮\n│𝐋𝐢𝐬𝐭 𝐨𝐟 𝐠𝐫𝐨𝐮𝐩 𝐜𝐡𝐚𝐭𝐬:\n${formattedList.map(line => `${line}`).join("\n")}\n╰───────────ꔪ`;
          await api.sendMessage(message, event.threadID);

          if (args[0] === "leave") {
            // Check if the command is to leave a specific group by number
            if (args[1] && !isNaN(args[1])) {
              const groupIndex = parseInt(args[1]) - 1;

              if (groupIndex >= 0 && groupIndex < filteredList.length) {
                const groupToRemove = filteredList[groupIndex];
                await api.removeUserFromGroup(api.getCurrentUserID(), groupToRemove.threadID);
                await api.sendMessage(`Bot has been removed from the group: ${groupToRemove.threadName}`, event.threadID);
              } else {
                await api.sendMessage('Invalid group number. Please provide a valid group number.', event.threadID);
              }
            } else if (event.senderID === 'BOT_OWNER_USER_ID') {
              // Check if the command is from the bot owner to leave a group
              const groupIndex = parseInt(args[1]) - 1;

              if (groupIndex >= 0 && groupIndex < filteredList.length) {
                const groupToRemove = filteredList[groupIndex];
                await api.removeUserFromGroup(api.getCurrentUserID(), groupToRemove.threadID);
                await api.sendMessage(`Bot has been removed from the group: ${groupToRemove.threadName}`, event.threadID);
              } else {
                await api.sendMessage('Invalid group number. Please provide a valid group number.', event.threadID);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error listing or removing group chats", error);
    }
  },
};