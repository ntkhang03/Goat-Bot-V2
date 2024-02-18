const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  config: {
    name: "write",
    aliases: [],
    author: "aminul",  
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "Write text on an image "
    },
    longDescription: {
      en: "Write text on an image and send. Reply to a photo with 'text1 | text2'."
    },
    category: "fun",
    guide: {
      en: "{p}write reply to photo text1 | text2"
    }
  },
  onStart: async function ({ api, event, args }) {
    let linkanh = event.messageReply.attachments[0]?.url;

    if (!linkanh) {
      return api.sendMessage('Please reply to a photo with the format "text1 | text2".', event.threadID, event.messageID);
    }

    const cleanedBody = args.join(" ").trim();

    const [text1, text2] = cleanedBody.split('|').map(item => item.trim());

    if (!text1 || !text2) {
      return api.sendMessage('Invalid format. Please provide text1 and text2 separated by |.', event.threadID, event.messageID);
    }

    try {
      const response = await axios.get(linkanh, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);
      const tempImageFilePath = path.join(os.tmpdir(), 'temp_image.jpg');

      fs.writeFileSync(tempImageFilePath, imageBuffer);

      const background = await loadImage(tempImageFilePath);
      const canvas = createCanvas(background.width, background.height);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


      ctx.font = 'bold 15px Arial'; // Adjust font size 
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';


      const borderWidth = 2;
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = 'black';

      ctx.strokeText(text1, canvas.width / 2, 10);
      ctx.fillText(text1, canvas.width / 2, 10);


      ctx.textBaseline = 'bottom';


      ctx.strokeText(text2, canvas.width / 2, canvas.height - 10);
      ctx.fillText(text2, canvas.width / 2, canvas.height - 10);

      const modifiedImageBuffer = canvas.toBuffer();
      const modifiedImageFilePath = path.join(os.tmpdir(), 'modified_image.jpg');

      fs.writeFileSync(modifiedImageFilePath, modifiedImageBuffer);

      api.sendMessage(
        {
          body: 'Here is your modified image 🖼️',
          attachment: fs.createReadStream(modifiedImageFilePath),
        },
        event.threadID,
        (err, messageInfo) => {
          fs.unlinkSync(tempImageFilePath);
          fs.unlinkSync(modifiedImageFilePath);

          if (err) {
            console.error('Error sending message:', err);
            api.sendMessage('An error occurred ', event.threadID, event.messageID);
          }
        }
      );
    } catch (error) {
      console.error(error);
      return api.sendMessage('An error occurred while processing the image.\nPlease try again later.', event.threadID, event.messageID);
    }
  }
};
