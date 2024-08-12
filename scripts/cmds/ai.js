const { getPrefix, getStreamFromURL, uploadImgbb } = global.utils;
async function ai({ message: m, event: e, args: a, usersData: u }) {
  var p = [`${await getPrefix(e.threadID)}${this.config.name}`,
`${this.config.name}`
/*"ai"
*you can add more prefix here
*/
]; 
 if (p.some(b => a[0].toLowerCase().startsWith(b))) {
try {      
let prompt = "";
if (e.type === "message_reply" && e.messageReply.attachments && e.messageReply.attachments[0]?.type === "photo") {
 const b = await uploadImgbb(e.messageReply.attachments[0].url);
prompt = a.slice(1).join(" ") + ' ' + b.image.url;
} else {
 prompt = a.slice(1).join(" ");
}
 var __ = [{ id: e.senderID, tag: await u.getName(e.senderID) }];
 const r = await require("axios").post(`https://test-ai-ihc6.onrender.com/api`, {
  prompt: prompt,
 apikey: "GayKey-oWHmMb1t8ASljhpgSSUI",
  name: __[0]['tag'],
 id: __[0]['id'],
 });
var _ = r.data.result.replace(/{name}/g, __[0]['tag']).replace(/{pn}/g, p[0]);
 if (r.data.av) {
 if (Array.isArray(r.data.av)) {
 const avs = r.data.av.map(url => getStreamFromURL(url));
 const avss = await Promise.all(avs);
  m.reply({
 body: _,
 mentions: __,
 attachment: avss
 });
 } else {
 m.reply({
 body: _,
 mentions: __,
attachment: await getStreamFromURL(r.data.av)
  });
  }
  } else {
m.reply({
body: _,
mentions: __
  });
  }
  } catch (error) {
 m.reply("Error " + error);
 }
 }
}
module.exports = {
config: {
 name: "ai",
aliases: [],
version: 1.6,
author: "Jun",
role: 0,
 shortDescription: "An AI that can do various tasks",
 guide: "{pn} <query>",
 category: "AI"
 },
 onStart: function() {},
 onChat: ai
};