const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "affect",
    version: "1.1",
    author: "KSHITIZ",
    countDown: 5,
    role: 0,
    shortDescription: "",
    longDescription: "",
    category: "image",
    guide: {
      vi: "{pn} [@tag | để trống]",
      en: ""
    }
  },

  onStart: async function ({ event, message, usersData }) {
    const uid = Object.keys(event.mentions)[0] || event.senderID;
    const avatarURL = await usersData.getAvatarUrl(uid);
    const img = await new DIG.Affect().getImage(avatarURL);
    const pathSave = `${__dirname}/tmp/${uid}_Affect.png`;
    fs.writeFileSync(pathSave, Buffer.from(img));
    message.reply({
      attachment: fs.createReadStream(pathSave)
    }, () => fs.unlinkSync(pathSave));
  }
};
