module.exports = {
  config: {
    name: "uptime",
aliases: ["upt"],
    version: "1.0",
    author: "OtinXSandip",
    role: 2,
    shortDescription: {
      en: "Displays the total number of users of the bot and check uptime "
    },
    longDescription: {
      en: "Displays the total number of users who have interacted with the bot and check uptime."
    },
    category: "system",
    guide: {
      en: "Use {p}totalusers to display the total number of users of the bot and check uptime."
    }
  },
  onStart: async function ({ api, event, args, usersData, threadsData }) {
    try {
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const uptime = process.uptime();
   const days = 
Math.floor(uptime / (3600 * 24));
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      
      const uptimeString = `${days}days ${hours}𝑯𝒓𝒔 ${minutes}𝑴𝒊𝒏 ${seconds}𝑺𝒆𝒄`;
      
      api.sendMessage(`✨| ✿𝐓𝐄𝐌𝐏𝐒 𝐃'𝐀𝐂𝐓𝐈𝐕𝐈𝐓𝐄 𝐃𝐔 𝐁𝐎𝐓✿\n☞ ${uptimeString}\n\n✡ | 𝐔𝐭𝐢𝐥𝐢𝐬𝐚𝐭𝐞𝐮𝐫𝐬 𝐭𝐨𝐭𝐚𝐥𝐬\n☞ ${allUsers.length}\n🎗| 𝐆𝐫𝐨𝐮𝐩𝐞 𝐭𝐨𝐭𝐚𝐥\n☞ ${allThreads.length}`, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while retrieving data.", event.threadID);
    }
  }
};
