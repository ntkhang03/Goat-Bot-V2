const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🐐 | GoatBot V2 ]"; // changing this wont change the goatbot V2 of list cmd it is just a decoyy

module.exports = {
  config: {
    name: "helpv3",
    version: "1.17",
    author: "NTKhang | Aesther", // original author Kshitiz 
    countDown: 5,
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

      msg += `》🌸𝗦𝗔𝗪𝗔𝗧𝗔𝗡𝗜🌸𝗖𝗠𝗗\n `; // replace with your name 

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += ` \n∗❥⃝*【 ${category.toUpperCase()} 】❥⃝*`;
const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 3).map((item) => `\n•—»✨ ${item} ✨«—•`);
            msg += ` ${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;
          }

          msg += ``;
        }
      });

      const totalCommands = commands.size;
      msg += `\n\n🔖𝗧𝗢𝗧𝗔𝗟 𝗖𝗺𝗱 [${totalCommands}📑]\n》𝙲𝚁𝙴𝙰𝚃𝙾𝚁:\n Aminul-Sordar\n𝙱𝚘𝚝 𝚎𝚗 𝙿𝚎𝚛𝚒𝚘𝚍𝚎 𝚍𝚎 𝚃𝚎𝚜𝚝 ☕ 𝚜𝚒 𝚟𝚘𝚞𝚜 𝚊𝚟𝚎𝚣 𝚍𝚎𝚜 𝚙𝚛𝚘𝚋𝚕𝚎𝚖𝚎s 𝚝𝚊𝚙𝚎𝚛 [/callad]`;
      msg += ``;
      msg += ``; // its not decoy so change it if you want 

      const helpListImages = [
        "https://i.ibb.co/JHS1WNL/image.gif", // add image link here
        "https://i.ibb.co/ZV5NdyJ/image.gif",

"https://i.ibb.co/CzRr9GH/image.gif",
        "https://i.ibb.co/9ZGVFSd/image.gif",

        "https://i.ibb.co/mTQfnHF/image.gif",

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

        const response = `╭── NAME ────⭓
  │ ${configCommand.name}
  ├── INFO
  │ Description: ${longDescription}
  │ Other names: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
  │ Other names in your group: Do not have
  │ Version: ${configCommand.version || "1.0"}
  │ Role: ${roleText}
  │ Time per command: ${configCommand.countDown || 1}s
  │ Author: ${author}
  ├── Usage
  │ ${usage}
  ├── Notes
  │ The content inside <XXXXX> can be changed
  │ The content inside [a|b|c] is a or b or c
  ╰━━━━━━━❖`;

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
