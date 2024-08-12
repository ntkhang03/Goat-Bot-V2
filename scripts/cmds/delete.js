const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "delete",
    aliases: ["del"],
    version: "1.0",
    author: "hedroxyy",
    countDown: 5,
    role: 2,
    shortDescription: "Delete file and folders",
    longDescription: "Delete file",
    category: "owner",
    guide: "{pn}"
  },

  onStart: async function ({ args, message, event }) {
    const commandName = args[0];

    if (!commandName) {
      return message.reply("Type the file name..");
    }

    const fileNameWithExtension = commandName.endsWith('.js') ? commandName : commandName + '.js';
    const filePath = path.join(__dirname, '..', 'cmds', fileNameWithExtension);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        message.reply("✅ | " + fileNameWithExtension + " Successfully Removed !!");
      } else {
        message.reply("Command file " + fileNameWithExtension + " unavailable!!");
      }
    } catch (err) {
      console.error(err);
      message.reply("Cannot be deleted because " + fileNameWithExtension + ": " + err.message);
    }
  }
};
