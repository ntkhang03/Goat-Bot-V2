const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "ads",
    version: "1.0",
    author: "Samir B. Thakuri",
    countDown: 1,
    role: 0,
    shortDescription: "Advertisement!",
    longDescription: "",
    category: "box chat",
    guide: "{pn} [mention|leave_blank]",
    envConfig: {
      deltaNext: 5
    }
  },

  langs: {
    vi: {
      noTag: "Bạn phải tag người bạn muốn tát"
    },
    en: {
      noTag: "You must tag the person you want to "
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    let mention = Object.keys(event.mentions)
    let uid;

    if (event.type == "message_reply") {
      uid = event.messageReply.senderID
    } else {
      if (mention[0]) {
        uid = mention[0]
      } else {
        console.log(" jsjsj")
        uid = event.senderID
      }
    }

    let url = await usersData.getAvatarUrl(uid)
    let avt = await new DIG.Ad().getImage(url)

    const pathSave = `${__dirname}/tmp/ads.png`;
    fs.writeFileSync(pathSave, Buffer.from(avt));

    let body = "Latest Brand In The Market 🥳"
    if (!mention[0]) body = "Latest Brand In The Market 🥳"

    // Send the image as a reply to the command message
    message.reply({
      body: body,
      attachment: fs.createReadStream(pathSave)
    }, () => fs.unlinkSync(pathSave));
  }
};
