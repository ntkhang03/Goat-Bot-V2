const { get } = require('axios');
const url = 'http://eu4.diresnode.com:3301';

module.exports = {
  config: {
    name: 'gojo',
    aliases: [],
    version: '1.0.0',
    author: 'Kshitiz',
    countDown: 0,
    role: 0,
    shortDescription: {
      en: 'Talk to GOJO AI (continues conversation)',
    },
    longDescription: {
      en: 'Talk to GOJO AI (continues conversation)',
    },
    category: 'AI',
    guide: {
      en: '{p}gojo message / onReply',
    },
  },

  async makeApiRequest(prompt, id) {
    try {
      const response = await get(`${url}/gojo_gpt?prompt=${prompt}&idd=${id}`);
      return response.data.gojo;
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
            commandName: 'gojo',
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

      const result = await this.makeApiRequest(prompt, id);
      this.sendMessage(message, result, (messageID) => {
        global.GoatBot.onReply.set(messageID, {
          commandName: 'gojo',
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
