const axios = require("axios");
const fs = require("fs-extra");
const canvas = require("canvas");

module.exports = {
  config: {
    name: "routineofnepalbanda",
    aliases: ["ronb"],
    author: "Fun",
    countDown: 5,
    role: 0,
    category: "Fun",
    shortDescription: {
      en: "make something RONB wrote about you or friends/ something",
    },
  },
  wrapText: async (ctx, text, maxWidth) => {
    return new Promise((resolve) => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText("W").width > maxWidth) return resolve(null);
      const words = text.split(" ");
      const lines = [];
      let line = "";
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
          else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth)
          line += `${words.shift()} `;
        else {
          lines.push(line.trim());
          line = "";
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  },

  onStart: async function ({ api, event, args }) {
    let { senderID, threadID, messageID } = event;
    const { loadImage, createCanvas } = require("canvas");
    const fs = require("fs-extra");
    const axios = require("axios");
    let pathImg = __dirname + "/cache/ronb.png";
    var text = args.join(" ");
    if (!text)return api.sendMessage(
      "Enter the content of the comment on the board",
      threadID,
      messageID
    );
    let getPorn = (
      await axios.get(`https://i.ibb.co/vhtV1x9/image.jpg`, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getPorn, "utf-8"));
    let baseImage = await loadImage(pathImg);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "200 25px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";
    let fontSize = 23;
    while (ctx.measureText(text).width > 2400) {
      fontSize--;
      ctx.font = `200 ${fontSize}px Arial, sans-serif`;
    }
    const lines = await this.wrapText(ctx, text, 990);
    ctx.fillText(lines.join("\n"), 50, 155); //comment
    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    return api.sendMessage(
      { attachment: fs.createReadStream(pathImg) },
      threadID,
      () => fs.unlinkSync(pathImg),
      messageID
    );
  },
};
