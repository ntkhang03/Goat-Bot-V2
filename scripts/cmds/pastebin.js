const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
  config: {
    name: "bin",
    aliases: ["pastebin"],
    version: "1.0",
    author: "rehat--",
    countDown: 5,
    role: 2,
    longDescription: {
      en: "This command allows you to upload files in tu33rtle-bin"
    },
    category: "owner",
    guide: {en: "To use this command, type .bin <name>"}
  },

  onStart: async function ({ api, event, args, content }) {
    const text = args.slice(1).join(" ");
    const permission = ["100086747072197"];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("You don't have enough permission to use this command. Gay only RYUK4ZI BAU can do it 😉 .", event.threadID, event.messageID);
    }
    if (!args[0]) {
      return api.sendMessage('Please learn how to use !bin <name>', event.threadID);
    }
    const fileName = args[0];
    const filePathWithoutExtension = path.join(__dirname, '..', 'cmds', fileName);
    const filePathWithExtension = path.join(__dirname, '..', 'cmds', fileName + '.js');

    if (!fs.existsSync(filePathWithoutExtension) && !fs.existsSync(filePathWithExtension)) {
      return api.sendMessage('File not found!', event.threadID);
    }

    const filePath = fs.existsSync(filePathWithoutExtension) ? filePathWithoutExtension : filePathWithExtension;
    fs.readFile(filePath, 'utf8', async (err, data) => { if (err) throw err;

      const pasteData = {
        name: fileName,
        content: data,
        key: "rehatXD",
        burn: "false",
        lock: "false",
        encrypt: "false"
      };
      try {
        const response = await axios.post("https://tu33rtle-bin.api-tu33rtle.repl.co/upload", pasteData);
        const rawPaste = response.data.url.replace("tu33rtle-bin.api-/tu33rtle.repl.co", "tu33rtle-bin.api-tu33rtle.repl.co/raw");
        api.sendMessage(`${rawPaste}`, event.threadID , event.messageID);

      } catch (error) {
        console.error(error);
      }
    });
  },
};