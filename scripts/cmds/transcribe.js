const axios = require("axios");

module.exports = {
  config: {
    name: "transcribe",
    version: "1.1",
    author: "MILAN",
    countDown: 10,
    role: 0,
    shortDescription: {
      vi: "Chuyển đổi lời nói thành văn bản.",
      en: "Converts speech into text."
    },
    longDescription: {
      vi: "Lệnh `transcribe` cho phép bạn trích xuất văn bản từ video hoặc âm thanh. Chỉ cần trả lời âm thanh hoặc video và lệnh sẽ sử dụng API để trích xuất văn bản từ âm thanh hoặc video. Văn bản trích xuất sẽ được gửi lại dưới dạng trả lời tin nhắn của bạn.",
      en: "The `transcribe` command allows you to extract texts from videos or audios. Simply reply to an audio or video, and the command will use the API to extract the text from the audio or video. The extracted text will be sent back as a reply to your message."
    },
    category: "tools",
    guide: {
      vi: "{pn} trả lời âm thanh/video",
      en: "{pn} reply to an audio/video"
    }
  },

  onStart: async function({ event, api, message }) {
    try {
      if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return message.reply('Please reply to an audio or video.');
      }

      const link = event.messageReply.attachments[0].url;
      const response = await axios.get(`https://milanbhandari.onrender.com/transcribe?url=${encodeURIComponent(link)}`);
      const text = response.data.transcript;

      if (text) {
        message.reply({
          body: text
        });
      } else {
        message.reply("Failed to transcribe the audio or video.");
      }
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while processing the request.");
    }
  }
};