module.exports = {
 config: {
 name: "yukihira",
 version: "1.0",
 author: "Jaychris Garcia",
 countDown: 5,
 role: 0,
 shortDescription: "no prefix",
 longDescription: "no prefix",
 category: "no prefix",
 }, 
 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "Memexd") {
 return message.reply({
 body: "hello, i'm YOUR JONNEY DAI.",
 attachment: await global.utils.getStreamFromURL("https://i.ibb.co/YcvGy8S/image.jpg",
"https://i.ibb.co/Msh5Wxk/image.jpg",
"https://i.ibb.co/xCz7ZRh/image.jpg",                       "https://i.ibb.co/5FsBcXx/image.jpg",
"https://i.ibb.co/WzWcJPK/image.jpg",                       "https://i.ibb.co/LY8b5P9/image.jpg",)
 });
 }
 }
}