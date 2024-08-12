.cmd install jail.js const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "jail",
    version: "1.1",
    author: "your love",
    countDown: 5,
    role: 0,
    shortDescription: "Jail image",
    longDescription: "Jail image",
    category: "fun",
    guide: {
      en: "{pn} @tag"
    }
  },

  langs: {
    vi: {
      noTag: "Bạn phải tag người bạn muốn tù"
    },
    en: {
      noTag: "TAG THE RAPIST 💀"
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];
    if (!uid2)
      return message.reply(getLang("noTag"));
    const avatarURL1 = await usersData.getAvatarUrl(uid1);
    const avatarURL2 = await usersData.getAvatarUrl(uid2);
    const img = await new DIG.Jail().getImage(avatarURL2);
    const pathSave = `${__dirname}/tmp/${uid2}_Jail.png`;
    fs.writeFileSync(pathSave, Buffer.from(img));
    const content = args.join(' ').replace(Object.keys(event.mentions)[0], "");
    message.reply({
      body: `WE CAUGHT THE CRIMINAL 👮‍♂️🚔`,
      attachment: fs.createReadStream(pathSave)
    }, () => fs.unlinkSync(pathSave));
  }
};
