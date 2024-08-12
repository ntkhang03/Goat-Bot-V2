const fetch = require('node-fetch');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "screenshot",
aliases: ["ss"],
    version: "1.0",
    author: "Fixed by JARiF",
    countDown: 5,
    role: 0,
    longDescription:  "Screenshot webpage or Google search",
    category: "wiki",
    guide: {
      en: "{pn} 'url'\pn} g- 'text'",
    },
  },

  onStart: async function ({args, message, event }) {

      
    if (args.length === 0) {
      message.reply(`invalid input⚠️\lease follow:\{p}screenshot <url> \r\{p}screenshot -g <text>.`);
      return;
    }
    const { getPrefix } = global.utils;
       const p = getPrefix(event.threadID);

    let url;
    if (args[0] === '-g') {
      if (args.length < 2) {
        message.reply(`invalid text input after -g Tag⚠️\lease follow:\{p}screenshot -g YourText`);
        return;
      }
      const query = args.slice(1).join('+');
      url = `https://www.google.com/search?q=${query}&tbm=isch`;
    } else {
      url = args[0];
      if (!url.match(/^https?:\.+$/)) {
        url = `https://${url}`;
      }
    }
    const apiURL = `https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${url}`;
    try {
      const res = await fetch(apiURL);
      if (!res.ok) {
        message.reply(`API not responding. try again later..!`);
        return;
      }
      const buffer = await res.buffer();
      const tag = Date.now();      fs.writeFileSync(`${tag}.jpg`, buffer);
      
      message.reply({
        body: `Here is the screenshot: `,
        attachment: fs.createReadStream(`${tag}.jpg`),
      }, () => fs.unlinkSync(`${tag}.jpg`));
    } catch (err) {
      console.log(err);
      message.reply(` error when generating the screenshot for ${url}.`);
    }
  },
};