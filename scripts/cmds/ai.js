const axios = require('axios');

const Prefixes = [
  'Stanley',
  'Barro',
  'stan',
  'B',
  'S',
  'ai',
  'ask',
];

module.exports = {
  config: {
    name: "ai",
    version: 1.0,
    author: "OtinXSandip",
    longDescription: "AI",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
   if (!prompt) {
        await message.reply("Hi, what can I help you?");
        return;
      }


      const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;

 
    await message.reply({ body: `This is my best answer
━━━━━━━━━━━━━        
${answer}
━━━━━━━━━━━━━
here and you‘re welcome`,
});

   } catch (error) {
      console.error("Error:", error.message);
    }
  }
}; 
