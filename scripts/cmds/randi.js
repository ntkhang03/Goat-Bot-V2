const { get } = require('axios');
const randiUrl = 'https://randi-5xps.onrender.com/kshitiz';

module.exports = {
  config: {
    name: 'randi',
    aliases: [],
    version: '1.0.0',
    author: 'Kshitiz',
    countDown: 0,
    role: 2,
    shortDescription: {
      en: 'Talk to Randi AI (continues conversation)',
    },
    longDescription: {
      en: 'Talk to Randi AI (continues conversation)',
    },
    category: 'AI',
    guide: {
      en: '{p}randi message / onReply',
    },
  },

  async makeApiRequest(prompt, id) {
    try {
      const response = await get(`${randiUrl}?content=${prompt}`);
      return response.data.chatResult;
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

  async onStart({ message, args }) {
    try {
      const prompt = args.join(' ');
      const id = message.senderID;

      if (!prompt) {
        this.sendMessage(
          message,
          `Missing input!\n\nIf you want to reset the conversation with ${this.config.name} you can use "${this.config.name} clear"`,
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
        const result = await this.makeApiRequest(prompt, id);
        this.sendMessage(message, result, (messageID) => {
          global.GoatBot.onReply.set(messageID, {
            commandName: this.config.name,
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
      this.sendMessage(message, error.message, (messageID) => {
        global.GoatBot.onReply.set(messageID, {
          commandName: this.config.name,
          messageID,
          author: message.senderID,
          tempFilePath: null,
        });
      });
    }
  },

  async onReply({ message, Reply, args }) {
    const { author, commandName, tempFilePath } = Reply;

    try {
      const prompt = args.join(' ');
      const id = message.senderID;

      if (!prompt) {
        this.sendMessage(message, 'Missing input!', (messageID) => {
          global.GoatBot.onReply.set(messageID, {
            commandName: this.config.name,
            messageID,
            author: message.senderID,
            tempFilePath: null,
          });
        });
        return;
      }

      const result = await this.makeApiRequest(prompt, id);
      this.sendMessage(message, result, (messageID) => {
        global.GoatBot.onReply.set(messageID, {
          commandName: this.config.name,
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
