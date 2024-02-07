const { get } = require('axios');
const kshitizApiUrl = 'https://chhitiz.onrender.com/kshitiz';

module.exports = {
  config: {
    name: 'kshitiz',
    aliases: [],
    version: '1.0.0',
    author: 'Kshitiz',
    countDown: 0,
    role: 0,
    shortDescription: {
      en: ' Kshitiz!',
    },
    longDescription: {
      en: ' Kshitiz!',
    },
    category: 'Personal',
    guide: {
      en: '{p}kshitiz',
    },
  },

  async kshitiz() {
    try {
      const response = await get(`${kshitizApiUrl}?query=`);
      return response.data.response;
    } catch (error) {
      throw error;
    }
  },

  sendMessage(message, body, onReplyCallback) {
    message.reply(
      {
        body: body,
      },
      (err, info) => {
        if (!err) {
          onReplyCallback(info.messageID);
        } else {
          console.error('Error sending message:', err);
        }
      }
    );
  },

  onStart: async function ({ message }) {
    try {
      try {
        const kshitizResponse = await this.kshitiz();
        this.sendMessage(message, kshitizResponse, (messageID) => {
          global.GoatBot.onReply.set(messageID, {
            commandName: 'kshitiz',
            messageID,
            author: message.senderID,
            tempFilePath: null,
          });
        });
      } catch (error) {
        console.error('Error:', error);
        this.sendMessage(
          message,
          'An error occurred while processing your request.',
          (messageID) => {
            global.GoatBot.onReply.set(messageID, {
              commandName: this.config.name,
              messageID,
              author: message.senderID,
              tempFilePath: null,
            });
          }
        );
      }
    } catch (error) {
      console.error('Error:', error);
      this.sendMessage(
        message,
        error.message,
        (messageID) => {
          global.GoatBot.onReply.set(messageID, {
            commandName: this.config.name,
            messageID,
            author: message.senderID,
            tempFilePath: null,
          });
        }
      );
    }
  },

  onReply: async function ({ message, Reply }) {
    const { author, commandName, tempFilePath } = Reply;

    try {
      const kshitizResponse = await this.kshitiz();
      this.sendMessage(message, kshitizResponse, (messageID) => {
        global.GoatBot.onReply.set(messageID, {
          commandName: 'kshitiz',
          messageID,
          author: message.senderID,
          tempFilePath: null,
        });
      });
    } catch (error) {
      console.error('Error:', error);
      this.sendMessage(
        message,
        'An error occurred while processing your request.',
        (messageID) => {
          global.GoatBot.onReply.set(messageID, {
            commandName: this.config.name,
            messageID,
            author: message.senderID,
            tempFilePath: null,
          });
        }
      );
    }
  },
};
