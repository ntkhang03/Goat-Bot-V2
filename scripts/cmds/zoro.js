const { get } = require('axios');
const zoroApiUrl = 'https://zoro-cuwd.onrender.com/kshitiz';

module.exports = {
  config: {
    name: 'zoro',
    aliases: [],
    version: '1.0.0',
    author: 'Kshitiz',
    countDown: 0,
    role: 0,
    shortDescription: {
      en: 'talk with Roronoa Zoro.',
    },
    longDescription: {
      en: 'talk with roronoa zoro',
    },
    category: 'ai',
    guide: {
      en: '{p}zoro <query>',
    },
  },

  async zoro(query) {
    try {
      const response = await get(`${zoroApiUrl}?query=${encodeURIComponent(query)}`);
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

  onStart: async function ({ message, args }) {
    try {
      const query = args.join(' ');

      if (!query) {
        this.sendMessage(
          message,
          `Missing input!\n\nUsage: ${this.config.name} <query>`,
          (messageID) => {
            global.GoatBot.onReply.set(messageID, {
              commandName: this.config.name,
              messageID,
              author: message.senderID,
              tempFilePath: null,
            });
          }
        );
        return;
      }

      try {
        const zoroInfo = await this.zoro(query);
        this.sendMessage(message, zoroInfo, (messageID) => {
          global.GoatBot.onReply.set(messageID, {
            commandName: 'zoro',
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

  onReply: async function ({ message, Reply, args }) {
    const { author, commandName, tempFilePath } = Reply;

    try {
      const query = args.join(' ');

      if (!query) {
        this.sendMessage(
          message,
          `Missing input!\n\nUsage: ${this.config.name} <query>`,
          (messageID) => {
            global.GoatBot.onReply.set(messageID, {
              commandName: this.config.name,
              messageID,
              author: message.senderID,
              tempFilePath: null,
            });
          }
        );
        return;
      }

      const zoroInfo = await this.zoro(query);
      this.sendMessage(message, zoroInfo, (messageID) => {
        global.GoatBot.onReply.set(messageID, {
          commandName: 'zoro',
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
