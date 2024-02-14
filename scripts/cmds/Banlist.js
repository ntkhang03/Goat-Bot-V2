const axios = require("axios");
const fs = require("fs");
const gtts = require("gtts");

module.exports = {
	config: {
  name: "bardv2",
  version: "1",
  usePrefix: true,
  hasPermission: 0,
  credits: "Arjhil",
  description: "Bard ai",
  usePrefix: true,
  commandCategory: "ai",
  usages: "<ask>",
  cooldowns: 5,
},

onStart: async function ({ api, event }) {
  const { threadID, messageID, type, messageReply, body } = event;

  let question = "";

  if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") {
    const attachment = messageReply.attachments[0];
    const imageURL = attachment.url;
    question = await convertImageToText(imageURL);

    if (!question) {
      api.sendMessage(
        "❌ Failed to convert the photo to text. Please try again with a clearer photo.",
        threadID,
        messageID
      );
      return;
    }
  } else {
    question = body.slice(5).trim();

    if (!question) {
      api.sendMessage("Please provide a question or query", threadID, messageID);
      return;
    }
  }

  api.sendMessage("Searching for an answer, please wait...", threadID, messageID);

  try {
    const res = await axios.get(
      `https://bard-ai.arjhilbard.repl.co/bard?ask=${encodeURIComponent(question)}`
    );

    const respond = res.data.message;
    const formattedAnswer = `📝  (𝗜𝗡𝗩𝗢𝗜𝗖𝗘) ${respond}`;

    const gttsPath = 'voice.mp3';
    const gttsInstance = new gtts(formattedAnswer, 'en');
    gttsInstance.save(gttsPath, function (error, result) {
      if (error) {
        console.error("Error saving gTTS:", error);
        api.sendMessage("❌ Error generating voice response.", threadID, messageID);
      } else {
        const textAnswer = `📝  (𝗔𝗜)\n\n📝: ${respond} `;
        const voiceAnswer = `Voice answer: ${respond}`;

        api.sendMessage(textAnswer, threadID, (error, messageInfo) => {
          if (!error) {
            api.sendMessage({
              body: voiceAnswer,
              attachment: fs.createReadStream(gttsPath)
            }, threadID);
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    api.sendMessage("❌ An error occurred while fetching data.", threadID, messageID);
  }
}
};

async function convertImageToText(imageURL) {
  const response = await axios.get(
    `https://bard-ai.arjhilbard.repl.co/api/other/img2text?input=${encodeURIComponent(imageURL)}`
  );
  return response.data.extractedText;
	}
		
