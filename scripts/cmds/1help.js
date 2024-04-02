const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🔖 | 𝙈𝙚𝙧𝙙𝙞 ]"; // changing this wont change the goatbot V2 of list cmd it is just a decoyy

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "NTKhang", // original author leeza 
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `🎯𝙇𝙐𝙉𝘼 𝙃𝙀𝙇𝙋 𝘾𝙈𝘿🎯 \n_____________________; // replace with your name 

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `───────\n│『 ${category.toUpperCase()}  』` ;


          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 3).map((item) => `🎯${item}`);
            msg += `\n│ ${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;
          }

          msg += `\n══════════`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n 𝙇𝙚 𝙣𝙤𝙢𝙗𝙧𝙚 𝙩𝙤𝙩𝙖𝙡 𝙙𝙚𝙨 𝘾𝙈𝘿🎯 𝙚𝙨𝙩 𝙙𝙚 ${totalCommands} \n`;
      msg += `𝙐𝙩𝙞𝙡𝙞𝙨𝙚 𝙡𝙚 𝙥𝙧𝙚𝙛𝙞𝙭 ${prefix} 𝙋𝙤𝙪𝙧 𝙥𝙤𝙪𝙫𝙤𝙞𝙧 𝙪𝙩𝙞𝙡𝙞𝙨𝙚𝙧 𝙩𝙤𝙪𝙩𝙚𝙨 𝙡𝙚𝙨 𝙘𝙤𝙢𝙢𝙖𝙣𝙙𝙚𝙨 💦\n`;
      msg += `💦 |𝙈𝙀𝙍𝘿𝙄'𝙎 𝘽𝙊𝙏`; // its not decoy so change it if you want 

      const helpListImages = [
        "https://i.ibb.co/7Qh46VN/image.jpg", // add image link here,
        // Add more image links as needed
      ];

      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage),
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `___________⤴ 𝙉𝘼𝙈𝙀 __________⤴
  ❍🎯 ${configCommand.name}
  ❍🎯 𝙄𝙉𝙁𝙊
  ❍🎯 𝘿𝙚𝙨𝙘𝙧𝙞𝙥𝙩𝙞𝙤𝙣: ${longDescription}
  ❍🎯 𝙊𝙩𝙝𝙚𝙧 𝙣𝙖𝙢𝙚𝙨: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
  ❍🎯 𝙊𝙩𝙝𝙚𝙧 𝙣𝙖𝙢𝙚𝙨 𝙞𝙣 𝙮𝙤𝙪𝙧 𝙜𝙧𝙤𝙪𝙥: 𝘿𝙤 𝙣𝙤𝙩 𝙝𝙖𝙫𝙚
  ❍🎯 𝙑𝙚𝙧𝙨𝙞𝙤𝙣: ${configCommand.version || "1.0"}
  ❍🎯 𝙍𝙤𝙡𝙚: ${roleText}
  ❍🎯 𝙏𝙞𝙢𝙚 𝙥𝙚𝙧 𝙘𝙤𝙢𝙢𝙖𝙣𝙙: ${configCommand.countDown || 1}s
  ❍🎯 𝘼𝙪𝙩𝙝𝙤𝙧: ${author}
  ❍🎯 𝙐𝙨𝙖𝙜𝙚
  ❍🎯 ${usage}
  ❍🎯 𝙉𝙤𝙩𝙚𝙨
  ❍🎯 𝙏𝙝𝙚 𝙘𝙤𝙣𝙩𝙚𝙣𝙩 𝙞𝙣𝙨𝙞𝙙𝙚 <𝙓𝙓𝙓𝙓𝙓> 𝙘𝙖𝙣 𝙗𝙚 𝙘𝙝𝙖𝙣𝙜𝙚𝙙
  ❍🎯 𝙏𝙝𝙚 𝙘𝙤𝙣𝙩𝙚𝙣𝙩 𝙞𝙣𝙨𝙞𝙙𝙚 [𝙖|𝙗|𝙘] 𝙞𝙨 𝙖 𝙤𝙧 𝙗 𝙤𝙧 𝙘 \n_____________________\n 🔖 𝙚𝙙𝙞𝙩𝙚 𝙗𝙮 : 🔴𝙈𝙚𝙧𝙙𝙞🔵
  `;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
	}
