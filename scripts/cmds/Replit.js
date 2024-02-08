module.exports = {
 config: {
 name: "Replit",
 version: "1.0",
 author: "aesther",
 countDown: 5,
 role: 0,
 shortDescription: "no prefix",
 longDescription: "no prefix",
 category: "contacts admin",
 }, 
 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "replit") {
 return message.reply({
 body: "◍𝗚𝗢𝗗𝗗𝗘𝗦𝗦-ABIR◍🔖\n𝗥𝗘𝗣𝗟𝗜𝗧🔖:\n   ➤https://replit.com/@AminulSordar/Goat-Bot \n\n 🥰AMINUL-SORDAR🥰",
 attachment: await global.utils.getStreamFromURL("https://i.postimg.cc/R0CPYFZw/3134efa370b7a7299172e3f8bb2e615e.gif")
 });
 }
 }
}
