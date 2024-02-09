
const fs = require('fs');

module.exports = {
  config: {
    name: "bot",
    version: "1.0",
    author: "Bot",
    countDown: 5,
    role: 0,
    shortDescription: "BOT",
    longDescription: "BOT",
    category: "Fun",
  },
 
  onStart: async function() {},
 
  onChat: async function({ event, message, getLang, api }) {
    
    if (event.body) {
      const word = event.body.toLowerCase();
      switch (word) {
        case "bot":
          
          const replies = [

"আমি এখন আমিনুল বসের সাথে বিজি আছি", "what are you asking me to do?", "I love you baby meye hole chipay aso", "Love you 3000-😍💋💝", "ji bolen ki korte pari ami apnar jonno?","আমাকে না ডেকে আমার বস আমিনুলকে একটা জি এফ দেন! link: https://www.facebook.com/profile.php?id=100071880593545", "Ato daktasen kn bujhlam na 😡", "jan bal falaba,🙂","ask amr mon vlo nei dakben na🙂", "Hmm jan ummah😘😘","jang hanga korba 🙂🖤","iss ato dako keno lojja lage to 🫦🙈","suna tomare amar valo lage,🙈😽","জি তুমি কি আমাকে ডেকেছো 😇🖤🥀","আমাকে আমাকে না ডেকে আমার বসকে ডাকো এই নেও LINK :- https://www.facebook.com/100071880593545","Hmmm sona 🖤 meye hoile kule aso ar sele hoile kule new 🫂😘","Yah This Bot creator : PRINCE RID((A.R))     link => https://www.facebook.com/100071880593545","হা বলো, শুনছি আমি 🤸‍♂️🫂","আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🙈", "তুমি কি আমাকে ডাকলে বন্ধু 🤖?", "I love you 💝", "ভালোবাসি তোমাকে 🤖", "Hi, I'm massanger Bot i can help you.?🤖","Use callad to contact admin!", "Hi, Don't disturb 🤖 🚘Now I'm going to Feni,Bangladesh..bye", "Hi, 🤖 i can help you~~~~" 
            
          ];
         api.setMessageReaction("❤️‍🩹", event.messageID, () => { }, true);
          const randomIndex = Math.floor(Math.random() * replies.length);
          message.reply({
          body: replies[randomIndex],
          });
          break;
          default:
          return; 
      }
    }
  },
};
