const { get } = require('axios');
const luffyApiUrl = 'https://luffy-sa57.onrender.com/kshitiz';

module.exports = {
  config: {
    name: 'luffy',
    aliases: [],
    version: '1.0.0',
    author: 'Kshitiz',
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "luffy",
    },
    longDescription: {
      en: "luffy character ai",
    },
    category: 'Ai',
    guide: {
      en: '{p}luffy <query>',
    },
  },

  async luffy(query) {
    try {
      const response = await get(`${luffyApiUrl}?query=${encodeURIComponent(query)}`);
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
        const luffyInfo = await this.luffy(query);
        this.sendMessage(message, luffyInfo, (messageID) => {
          global.GoatBot.onReply.set(messageID, {
            commandName: 'luffy',
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

      const luffyInfo = await this.luffy(query);
      this.sendMessage(message, luffyInfo, (messageID) => {
        global.GoatBot.onReply.set(messageID, {
          commandName: 'luffy',
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
