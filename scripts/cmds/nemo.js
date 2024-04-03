const axios = require('axios');
const fs = require("fs-extra");
module.exports = {
  config: {
    name: "nemo",
aliases: ["sandy"], 
    version: 2.0,
    author: "OtinXSandip",
    longDescription: "ai with diff utilities",
    category: "ai",
    guide: {
      en: "{p}{n} questions\nsdxl\nimagine\nart\ngen\ndraw\nnsfw\nanime\nsay\nmusic\ncdp\nvideo",
    },
  },
  onStart: async function ({ message, event, Reply, args, api, usersData }) {
    try {
      const id = event.senderID;
      const userData = await usersData.get(id);
      const name = userData.name;
      const ment = [{ id, tag: name }];
      const prompt = args.join(" ");
      
      if (!prompt) {
        return message.reply("Please provide questions or\nnemo gen cat\nnemo draw cat\nnemo art\nnemo imagine\nnemo sdxl\nnemo say or tts\nnemo song\nnemo anime\nnemo nsfw\nnemo cdp\nnemo video");
      }

      const encodedPrompt = encodeURIComponent(prompt);

      if (prompt.includes("sdxl")) {
        const [promptText, model] = args.join(' ').split('|').map((text) => text.trim());
        const puti = model || "2";
        const baseURL = `https://sandipapi.onrender.com/sdxl?prompt=${promptText}&model=${puti}`;

        message.reply({
          body: `${name}`,
          mentions: ment,
          attachment: await global.utils.getStreamFromURL(baseURL)
        });
      } 
      else if (prompt.includes("nsfw")) {
  const { data } = await axios.get(`https://sandipapi.onrender.com/nsfw`);
  const imageRandom = await global.utils.getStreamFromURL(data.url);
  return message.reply({ body: `${name}`,
mentions: ment,
    attachment: imageRandom
  });
}
else if (prompt.includes("cdp")) {
  const { data } = await axios.get("https://sandipapi.onrender.com/dp");
  const maleImg = await axios.get(data.male, { responseType: "arraybuffer" });
  fs.writeFileSync(__dirname + "/tmp/img1.png", Buffer.from(maleImg.data, "utf-8"));
  const femaleImg = await axios.get(data.female, { responseType: "arraybuffer" });
  fs.writeFileSync(__dirname + "/tmp/img2.png", Buffer.from(femaleImg.data, "utf-8"));

  const msg = `${name}`;
  const allImages = [
    fs.createReadStream(__dirname + "/tmp/img1.png"),
    fs.createReadStream(__dirname + "/tmp/img2.png")
  ];

  message.reply({
    body: msg,
    attachment: allImages
  });
}
      else if (prompt.includes("imagine")) {
        let promptText, model;
        if (prompt.includes("|")) {
          [promptText, model] = prompt.split("|").map((str) => str.trim());
        } else {
          promptText = prompt;
          model = 19;
        }
        const response = await axios.get(`https://shivadon.onrender.com/test?prompt=${encodeURIComponent(promptText)}&model=${model}`);
        const img = response.data.combinedImageUrl;
        message.reply({
          body: `${name}`,
          mentions: ment,
          attachment: await global.utils.getStreamFromURL(img)
        });
      } else if (prompt.includes("draw")) {
        const [promptText, model] = args.join(' ').split('|').map((text) => text.trim());
        const puti = model || "5";
        const baseURL = `https://sandipapi.onrender.com/jeevan?prompt=${promptText}&model=${puti}`;

        message.reply({
          body: `${name}`,
          mentions: ment,
          attachment: await global.utils.getStreamFromURL(baseURL)
        });
      } else if (prompt.includes("gen")) {
        const [promptText, model] = args.join(' ').split('|').map((text) => text.trim());
        const puti = model || "19";
        const baseURL = `https://sandipapi.onrender.com/gen?prompt=${promptText}&model=${puti}`;

        message.reply({
          body: `${name}`,
          mentions: ment,
          attachment: await global.utils.getStreamFromURL(baseURL)
        });
      } else if (prompt.includes("art")) {
        const imgurl = encodeURIComponent(event.messageReply.attachments[0].url);

        const [promptText, model] = prompt.split('|').map((text) => text.trim());
        const puti = model || "37";

        const lado = `https://sandipapi.onrender.com/art?imgurl=${imgurl}&prompt=${encodeURIComponent(promptText)}&model=${puti}`;
        const attachment = await global.utils.getStreamFromURL(lado);
        message.reply({
          body: `${name}`,
          mentions: ment,
          attachment,
        });
      } 

else if (prompt.includes("anime")) {
  const { data } = await axios.get(`https://sandipapi.onrender.com/anime`);
  const imageRandom = await global.utils.getStreamFromURL(data.url);
  return message.reply({ body: `${name}`,
mentions: ment,
    attachment: imageRandom
  });
}
 else if (prompt.includes("say") || prompt.includes("|tts")) {
  const text = event.type === 'message_reply' ? event.messageReply.body : args.join(' ');

  const [lado, model] = args.join(" ").split('|').map((text) => text.trim());
  const puti = model || "18";
  const link = `https://sandipapi.onrender.com/speak?text=${text}&model=${puti}`;

  try {
    const response = await axios.get(link);
    const speak_url = response.data.speak_url;

    message.reply({
      body: `${name}`,
mentions: ment,
      attachment: await global.utils.getStreamFromURL(speak_url)
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}
else if (prompt.includes("music")) {
  const song = args.join(" ");
  const link = `https://sandipapi.onrender.com/music?song=${encodeURIComponent(song)}`;

  message.reply({
    body: `${name}`,
    mentions: ment,
    attachment: await global.utils.getStreamFromURL(link)
  });
} 
else if (prompt.includes("video")) {
  const song = args.join(" ");
  const link = `https://sandipapi.onrender.com/video?song=${encodeURIComponent(song)}`;

  message.reply({
    body: `${name}`,
    mentions: ment,
    attachment: await global.utils.getStreamFromURL(link)
  });
}
else {
        const response = await axios.get(`https://sandipapi.onrender.com/gpt?prompt=${encodedPrompt}`);
        const lado = response.data.answer;

        message.reply({
          body: `${name}: ${lado}`,
          mentions: ment,
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  },
};
