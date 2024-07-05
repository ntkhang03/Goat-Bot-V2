const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "findgay",
    version: "1.0",
    author: "@tas33n",
    countDown: 1,
    role: 0,
    shortDescription: "find gay",
    longDescription: "",
    category: "box chat",
    guide: "{pn} {{[on | off]}}",
    envConfig: {
      deltaNext: 5
    }
  },

  langs: {
    vi: {
      noTag: "Bạn phải chọn người muốn tìm (tag)"
    },
    en: {
      noTag: "You must choose who you want to find (tag)"
    }
  },

  onStart: async function ({ api, event, message, usersData, args, getLang }) {
    const { threadID, messageID, senderID } = event;
    const { participantIDs } = await api.getThreadInfo(threadID);
    const botID = api.getCurrentUserID();
    const listUserID = participantIDs.filter(ID => ID != botID);

    // Ensure there are at least two participants in the thread
    if (listUserID.length < 2) {
      return message.reply(getLang("noTag"));
    }

    // Randomly select one member
    let randomIndex = Math.floor(Math.random() * listUserID.length);
    let uid = listUserID[randomIndex];

    let url = await usersData.getAvatarUrl(uid);
    let avt = await new DIG.Gay().getImage(url);

    const pathSave = `${__dirname}/tmp/gay.png`;
    fs.writeFileSync(pathSave, Buffer.from(avt));

    let memberName = (await usersData.get(uid)).name; // Get the name of the tagged member

    let body = `GOTCHA 🏳️‍🌈`;

    // Sending message with image
    let msg = {
      body: body,
      mentions: [{ id: uid, tag: memberName }],
      attachment: fs.createReadStream(pathSave)
    };

    message.reply(msg, () => {
      fs.unlinkSync(pathSave);
    });
  }
};
