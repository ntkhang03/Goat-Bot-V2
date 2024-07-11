const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "info",
    version: "1.3",
    author: "AceGun",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "Sends information about the bot and admin along with an image."
    },
    longDescription: {
      vi: "",
      en: "Sends information about the bot and admin along with an image."
    },
    category: "utility",
    guide: {
      en: "{pn}"
    },
    envConfig: {}
  },

  onStart: async function ({ message }) {
    const botName = "DOREAMON";
    const botPrefix = "!";
    const authorName = "RYUKAZI";
    const authorFB = "https://www.facebook.com/profile.php?id=100086747072197&mibextid=kFxxJD";
    const authorInsta = "https://www.instagram.com/a_tomi_xx?igsh=enp1M2wzZzRkank5";
    const status ="CAN I FUCK YOU 🤷💗";

    const urls = JSON.parse(fs.readFileSync('loid.json'));
    const link = urls[Math.floor(Math.random() * urls.length)];

    const now = moment().tz('Asia/Manila');
    const date = now.format('MMMM Do YYYY');
    const time = now.format('h:mm:ss A');

    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

    message.reply({
      body: `===「 Bot & Owner Info 」===\n❏Bot Name: ${botName}\n❏Bot Prefix: ${botPrefix}\n❏Name: ${authorName}\n❏Facebook: ${authorFB}\n❏Instagram: ${authorInsta}\n❏Status: ${status}\n❏Date: ${date}\n❏Time: ${time}\n!Uptime: ${uptimeString}\n=====================`,
      attachment: await global.utils.getStreamFromURL(link)
    });
  },

  onChat: async function({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "info") {
      this.onStart({ message });
    }
  }
};