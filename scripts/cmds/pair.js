const axios = require ("axios");
const fs = require ("fs-extra");

module.exports = {
  config: {
    name: "pair",
    aliases: [],
    version: "1.0",
    author: "Rishad",
    countDown: 5,
    role: 0,
    shortDescription: " ",
    longDescription: "",
    category: "fun",
    guide: "{pn}"
  },

  onStart: async function({ api, event, threadsData, usersData }) {

    const { threadID, messageID, senderID } = event;
    const { participantIDs } = await api.getThreadInfo(threadID);
    var tle = Math.floor(Math.random() * 101);
    var namee = (await usersData.get(senderID)).name
    const botID = api.getCurrentUserID();
    const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);
    var id = listUserID[Math.floor(Math.random() * listUserID.length)];
    var name = (await usersData.get(id)).name
    var arraytag = [];
    arraytag.push({ id: senderID, tag: namee });
    arraytag.push({ id: id, tag: name });

    let Avatar = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));

    let gifLove = (await axios.get(`https://i.ibb.co/wC2JJBb/trai-tim-lap-lanh.gif`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8"));

    let Avatar2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));

    var imglove = [];

    imglove.push(fs.createReadStream(__dirname + "/cache/avt.png"));
    imglove.push(fs.createReadStream(__dirname + "/cache/giflove.png"));
    imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));

    var msg = {
      body: `🥰Successful pairing!💌Wish you two hundred years of happiness💕Double ratio: ${tle}% ${namee} 💓 ${name}`,
      mentions: arraytag,
      attachment: imglove
    };

    return api.sendMessage(msg, event.threadID, event.messageID);
  }
};