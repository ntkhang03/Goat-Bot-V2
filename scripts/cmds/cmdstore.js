const axios = require("axios");

module.exports = {
  config: {
    name: 'cmdstore',
    version: '1.0',
    author: 'Vex_Kshitiz',
    role: 0,
    shortDescription: 'store of cmds',
    longDescription: 'store of cmds all  made by kshitiz',
    category: 'utility',
    guide: {
      en: 'To view commands: {p}cmdstore\nTo paginate: {p}cmdstore {page}\nTo search: {p}cmdstore {search}'
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      let page = 1;
      let searchQuery = "";

      if (args.length === 1 && !isNaN(parseInt(args[0]))) {
        page = parseInt(args[0]);
      } else if (args.length === 1 && typeof args[0] === 'string') {
        searchQuery = args[0];
      } else if (args.length === 2 && args[0] === 'search' && typeof args[1] === 'string') {
        searchQuery = args[1];
      }

      const response = await axios.get("https://cmd-store.vercel.app/kshitiz");
      const commands = response.data;

      let filteredCommands = commands;
      if (searchQuery) {
        filteredCommands = commands.filter(cmd => cmd.cmdName.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      const startIndex = (page - 1) * 10;
      const endIndex = page * 10;
      const paginatedCommands = filteredCommands.slice(startIndex, endIndex);

      let replyMessage = "";
      paginatedCommands.forEach(cmd => {
        replyMessage += `
        𝗜𝗗:${cmd.id}
        𝗖𝗠𝗗:${cmd.cmdName}
        𝗖𝗢𝗗𝗘:${cmd.codeLink}
        𝗜𝗡𝗙𝗢:${cmd.description}
      ----------------------------------------------`;
      });

      if (replyMessage === "") {
        replyMessage = "No commands found.";
      }

      message.reply(replyMessage, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "cmdstore",
          messageID: info.messageID,
          author: event.senderID,
          commands,
        });
      });
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while fetching commands.");
    }
  },

  onReply: async function ({ api, event, Reply, args, message }) {
    const { author, commandName, commands } = Reply;

    if (event.senderID !== author || !commands) {
      return;
    }

    const commandID = parseInt(args[0], 10);

    if (isNaN(commandID) || !commands.some(cmd => cmd.id === commandID)) {
      message.reply("Invalid input.\nPlease provide a valid command ID.");
      return;
    }

    const selectedCommand = commands.find(cmd => cmd.id === commandID);

    let replyMessage = `
    𝗜𝗗:${selectedCommand.id}
    𝗖𝗠𝗗:${selectedCommand.cmdName}
    𝗖𝗢𝗗𝗘:${selectedCommand.codeLink}
    𝗜𝗡𝗙𝗢:${selectedCommand.description}`;

    message.reply(replyMessage);
    global.GoatBot.onReply.delete(event.messageID);
  },
};
