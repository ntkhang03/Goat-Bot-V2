const axios = require("axios");
const fs = require("fs-extra");
module.exports = {
 config: {
 name: "pair2",
 countDown: 10,
 role: 0,
 shortDescription: {
 en: "Get to know your partner",
 },
 longDescription : {
 en: "Know your destiny and know who you will complete your life with",
 },
 category: "love",
 guide: {
 en: "{pn}"
 }
},
onStart: async function ({ api, args, message, event, threadsData, usersData, dashBoardData, globalData, threadModel, userModel, dashBoardModel, globalModel, role, commandName, getLang }) {
const { loadImage, createCanvas } = require("canvas");
 let pathImg = __dirname + "/assets/background.png";
 let pathAvt1 = __dirname + "/assets/any.png";
 let pathAvt2 = __dirname + "/assets/avatar.png";
 
 var id1 = event.senderID;
 var name1 = await usersData.getName(id1);
 var ThreadInfo = await api.getThreadInfo(event.threadID);
 var all = ThreadInfo.userInfo
 for (let c of all) {
 if (c.id == id1) var gender1 = c.gender;
 };
 const botID = api.getCurrentUserID();
 let ungvien = [];
 if(gender1 == "FEMALE"){
 for (let u of all) {
 if (u.gender == "MALE") {
 if (u.id !== id1 && u.id !== botID) ungvien.push(u.id)
 }
 }
 }
 else if(gender1 == "MALE"){
 for (let u of all) {
 if (u.gender == "FEMALE") {
 if (u.id !== id1 && u.id !== botID) ungvien.push(u.id)
 }
 }
 }
 else {
 for (let u of all) {
 if (u.id !== id1 && u.id !== botID) ungvien.push(u.id)
 }
 }
 var id2 = ungvien[Math.floor(Math.random() * ungvien.length)];
 var name2 = await usersData.getName(id2);
 var rd1 = Math.floor(Math.random() * 100) + 1;
 var cc = ["0", "-1", "99,99", "-99", "-100", "101", "0,01"];
 var rd2 = cc[Math.floor(Math.random() * cc.length)];
 var djtme = [`${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd2}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`];
 
 var tile = djtme[Math.floor(Math.random() * djtme.length)];

 var background = [
 "https://i.ibb.co/RBRLmRt/Pics-Art-05-14-10-47-00.jpg"
 ];
 
 let getAvtmot = (
 await axios.get( `https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
 { responseType: "arraybuffer" }
 )
 ).data;
 fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

 let getAvthai = (
 await axios.get( `https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
 { responseType: "arraybuffer" }
 )
 ).data;
 fs.writeFileSync(pathAvt2, Buffer.from(getAvthai, "utf-8"));

 let getbackground = (
 await axios.get(`${background}`, {
 responseType: "arraybuffer",
 })
 ).data;
 fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

 let baseImage = await loadImage(pathImg);
 let baseAvt1 = await loadImage(pathAvt1);
 let baseAvt2 = await loadImage(pathAvt2);
 let canvas = createCanvas(baseImage.width, baseImage.height);
 let ctx = canvas.getContext("2d");
 ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
 ctx.drawImage(baseAvt1, 111, 175, 330, 330);
 ctx.drawImage(baseAvt2, 1018, 173, 330, 330);
 const imageBuffer = canvas.toBuffer();
 fs.writeFileSync(pathImg, imageBuffer);
 fs.removeSync(pathAvt1);
 fs.removeSync(pathAvt2);
 return api.sendMessage({ body: `『💗』Congratulations ${name1}『💗』\『❤️』Looks like your destiny brought you together with ${name2}『❤️』\『🔗』Your link percentage is ${tile}%『🔗』`,
 mentions: [{
 tag: `${name2}`,
 id: id2
 },{tag: `${name1}`, id: id1 }], attachment: fs.createReadStream(pathImg) },
 event.threadID,
 () => fs.unlinkSync(pathImg),
 event.messageID);
}
}