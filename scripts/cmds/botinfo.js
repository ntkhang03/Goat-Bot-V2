
const axios = require('axios');
const moment = require('moment-timezone');
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
module.exports = {
  config: {
    name: 'botinfo',

    author: 'aminulsordar',
    countDown: 5,
    role: 0,
    category: 'no prefix',
    longDescription: {
      en: "Check Bot Information" 
    }
  },

  onStart: async function({ event, api, message, args, usersData, threadsData, Thread }) {
    try {
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const uptime = process.uptime();

      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const uptimeString = `${hours} : ${minutes} : ${seconds}s`;

      const currentDate = moment().tz('Asia/Manila').format('YYYY-MM-DD');
      const currentTime = moment().tz('Asia/Manila').format('HH:mm:ss');
      const totalCommands = commands.size;

    const voidX = ` ‧̍̊·̊‧̥°̩̥˚̩̩̥͙°̩̥‧̥·̊‧̍̊ 🛸 °̩̥˚̩̩̥͙°̩̥ ·͙*̩̩͙˚̩̥̩̥*̩̩̥͙·̩̩̥͙*̩̩̥͙˚̩̥̩̥*̩̩͙‧͙ °̩̥˚̩̩̥͙°̩̥ 🪐 ‧̍̊·̊‧̥°̩̥˚̩̩̥͙°̩̥‧̥·̊‧̍̊
    👾 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 📜\n✧⋄⋆⋅⋆✧⋆⋅⋆⋄✧⋄⋆⋅⋆✧⋆⋅⋆⋄✧⋆⋅⋆⋄✧
              🕰 𝑪𝑳𝑶𝑪𝑲 
⚡ ꜱʏꜱᴛᴇᴍ ᴜᴘ ⟩ ${uptimeString}
⏰ ᴛɪᴍᴇ ⟩ ${currentTime}
🧮 ᴅᴀᴛᴇ ⟩ ${currentDate}
🌐 ᴛɪᴍᴇᴢᴏɴᴇ ⟩ ${global.GoatBot.config.timeZone}
✧⋄⋆⋅⋆✧⋆⋅⋆⋄✧⋄⋆⋅⋆✧⋆⋅⋆⋄✧⋆⋅⋆⋄✧
       ⚙ 𝑺𝑬𝑻𝑻𝑰𝑵𝑮 𝑪𝑶𝑵𝑭𝑰𝑮 🛠
𝙱𝚘𝚝 𝙽𝚊𝚖𝚎 › ${global.GoatBot.config.nickNameBot}\n𝙱𝚘𝚝 𝙿𝚛𝚎𝚏𝚒𝚡 › ${global.GoatBot.config.prefix}
𝙱𝚘𝚝 𝚃𝚘𝚝𝚊𝚕 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜 › ${totalCommands}
𝙱𝚘𝚝 𝙻𝚊𝚗𝚐𝚞𝚊𝚐𝚎 › ${global.GoatBot.config.language}`;
      const voidSetting = ``

      const response = await axios.get('https://api-test.yourboss12.repl.co/stats/hello');
      const data = response.data;

      const sortedData = data.sort((a, b) => b[Object.keys(b)[0]] - a[Object.keys(a)[0]]);

      api.setMessageReaction("⏱️", event.messageID, () => {}, true);


      let voidZ = `${voidX}\n𝙱𝚘𝚝 𝚄𝚜𝚎𝚛𝚜 › ${allUsers.length}\n𝙱𝚘𝚝 𝙶𝚛𝚘𝚞𝚙𝚜 › ${allThreads.length}`;

         return message.reply({
 body: `${voidZ}`, 
 attachment: await global.utils.getStreamFromURL("https://i.imgur.com/h0ctOAx.jpeg")
 });
    } catch (error) {
      console.error(error);
    }
}
};
