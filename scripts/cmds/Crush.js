const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
 config: {
 name: "crush",
 aliases: [],
 version: "1.0",
 author: "AceGun",
 countDown: 5,
 role: 0,
 shortdescription: "هديه للكراش",
 longDescription: "wholesome avatar for crush/lover",
 category: "𝗟𝗢𝗩𝗘",
 guide: ""
 },

 onStart: async function ({ message, event, args }) {
 const mention = Object.keys(event.mentions);
 if (mention.length == 0) {
 message.reply("TAG");
 return;
 }

 let one;
 if (mention.length == 1) {
 one = mention[0];
 } else {
 one = mention[0];
 }

 try {
 const imagePath = await bal(one);
 await message.reply({
 body: "「 is that true?🥰❤️ 」",
 attachment: fs.createReadStream(imagePath)
 });
 } catch (error) {
 console.error("Error while running command:", error);
 await message.reply("an error occurred");
 }
 }
};
async function bal(one) {
 const avatarone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=66262`);
 const image = await jimp.read("https://i.imgur.com/BnWiVXT.jpg");
 image.resize(512, 512).composite(avatarone.resize(173, 173), 70, 186);
 const imagePath = "wholesome.png";
 await image.writeAsync(imagePath);
 return imagePath;
}
