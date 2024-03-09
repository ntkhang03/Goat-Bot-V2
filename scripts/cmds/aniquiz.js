const a = require('axios');
const b = require('fs-extra');
const c = require('path');
const d = require('util'); 

const e = c.join(__dirname, 'cache');
const f = c.join(__dirname, 'anime.json');

module.exports = {
  config: {
    name: "aniquiz",
    aliases: ["animequiz"],
    version: "1.0",
    author: "Kshitiz",
    role: 0,
    shortDescription: "Guess the anime character",
    longDescription: "Guess the name of the anime character based on provided traits and tags.",
    category: "game",
    guide: {
      en: "{p}aniquiz"
    }
  },

  onStart: async function ({ event, message, usersData, api, args }) {
    try {
      if (!event || !message) return;
      if (args.length === 1 && args[0] === "top") {
        return await this.showTopPlayers({ message, usersData, api });
      }

      const h = await this.fetchCharacterData();
      if (!h || !h.data) {
        console.error("error");
        message.reply("error");
        return;
      }

      const { image, traits, tags, fullName, firstName } = h.data;

      const imageStream = await this.downloadImage(image);

      if (!imageStream) {
        console.error("Error");
        message.reply("An error occurred.");
        return;
      }

      const audiobody = `
𝐆𝐮𝐞𝐬𝐬 𝐭𝐡𝐞 𝐚𝐧𝐢𝐦𝐞 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫!!
𝐓𝐫𝐚𝐢𝐭𝐬: ${traits}
𝐓𝐚𝐠𝐬: ${tags}
`;

      const replyMessage = { body: audiobody, attachment: imageStream };
      const sentMessage = await message.reply(replyMessage);

      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName: this.config.name,
        messageID: sentMessage.messageID,
        correctAnswer: [fullName, firstName],
        senderID: event.senderID 
      });

     
      setTimeout(async () => {
        await api.unsendMessage(sentMessage.messageID);
      }, 15000);
    } catch (error) {
      console.error("Error:", error);
      message.reply("An error occurred.");
    }
  },

  onReply: async function ({ message, event, Reply, api }) {
    try {
      if (!event || !message || !Reply) return; 
      const userAnswer = event.body.trim().toLowerCase();
      const correctAnswers = Reply.correctAnswer.map(name => name.toLowerCase());

     
      if (event.senderID !== Reply.senderID) return;

      if (correctAnswers.includes(userAnswer)) {
        await this.addCoins(event.senderID, 1000);
        await message.reply("🎉🎊 Congratulations! Your answer is correct.\nYou have received 1000 coins.");
      } else {
        await message.reply(`🥺 Oops! Wrong answer.\nThe correct answer was:\n${Reply.correctAnswer.join(" or ")}`);
      }

      
      const animeMessageID = Reply.messageID;
      await api.unsendMessage(animeMessageID);

     
      await api.unsendMessage(event.messageID);
    } catch (error) {
      console.error("Error while handling user reply:", error);
    }
  },

  showTopPlayers: async function ({ message, usersData, api }) {
    try {
      const j = await this.getTopUsers(usersData, api);
      if (j.length === 0) {
        return message.reply("No users found.");
      } else {
        const topUsersString = j.map((user, index) => `${index + 1}. ${user.username}: ${user.money} coins`).join("\n");
        return message.reply(`Top 5 pro players:\n${topUsersString}`);
      }
    } catch (error) {
      console.error("Error while showing top players:", error);
      message.reply("An error occurred.");
    }
  },

  fetchCharacterData: async function () {
    try {
      const k = await a.get('https://animequiz-mu.vercel.app/kshitiz');
      return k;
    } catch (error) {
      console.error("Error fetching anime character data:", error);
      return null;
    }
  },

  downloadImage: async function (imageUrl) {
    try {
      const l = `anime_character.jpg`;
      const m = c.join(e, l);

      const n = await a.get(imageUrl, { responseType: 'arraybuffer' });
      if (!n.data || n.data.length === 0) {
        console.error("Empty image data received from the API.");
        return null;
      }

      await b.ensureDir(e); 
      await b.writeFile(m, n.data, 'binary');

      return b.createReadStream(m);
    } catch (error) {
      console.error("Error downloading image:", error);
      return null;
    }
  },

  addCoins: async function (o, amount) {
    let p = await this.q(o);
    if (!p) {
      p = { money: 0 };
    }
    p.money += amount;
    await this.r(o, p);
  },

  q: async function (o) {
    try {
      const data = await b.readFile(f, 'utf8');
      const p = JSON.parse(data);
      return p[o];
    } catch (error) {
      if (error.code === 'ENOENT') {
        await b.writeFile(f, '{}');
        return null;
      } else {
        console.error("Error reading user data:", error);
        return null;
      }
    }
  },

  r: async function (o, data) {
    try {
      const p = await this.q(o) || {};
      const q = { ...p, ...data };
      const r = await this.s();
      r[o] = q;
      await b.writeFile(f, JSON.stringify(r, null, 2), 'utf8');
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  },

  s: async function () {
    try {
      const data = await b.readFile(f, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading user data:", error);
      return {};
    }
  },

  getTopUsers: async function (usersData, api) {
    try {
      const t = await this.s();
      const u = Object.keys(t);
      const v = [];

      const w = d.promisify(api.getUserInfo);

      await Promise.all(u.map(async (o) => {
        try {
          const x = await w(o);
          const y = x[o].name;
          if (y) {
            const z = t[o];
            v.push({ username: y, money: z.money });
          }
        } catch (error) {
          console.error("Failed to retrieve user information:", error);
        }
      }));

      v.sort((a, b) => b.money - a.money);
      return v.slice(0, 5); 
    } catch (error) {
      console.error("Error getting top users:", error);
      return [];
    }
  }
};
