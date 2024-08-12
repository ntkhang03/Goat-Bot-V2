const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "wanted",
    version: "1.1",
    author: "hedroxyy",
    countDown: 5,
    role: 0,
    shortDescription: "Generate a 'wanted' image with your own avatar.",
    longDescription: "Generate a 'wanted' image with your own avatar.",
    category: "image",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ event, message, usersData }) {
    const uid = event.senderID;
    const avatarURL = await usersData.getAvatarUrl(uid); // Fetch your own avatar URL
    
    const img = await new DIG.Wanted().getImage(avatarURL);
    const pathSave = `${__dirname}/tmp/${uid}_Wanted.png`;
    
    fs.writeFileSync(pathSave, Buffer.from(img));
    
    message.reply({
      body: "「 🔥 」",
      attachment: fs.createReadStream(pathSave)
    }, () => fs.unlinkSync(pathSave));
  }
};
