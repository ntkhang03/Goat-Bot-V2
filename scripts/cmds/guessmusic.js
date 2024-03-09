const axios = require('axios');
const fs = require('fs-extra');
const ytdl = require('@neoxr/ytdl-core');
const yts = require('yt-search');
const path = require('path');
const util = require('util');

const userDataFilePath = path.join(__dirname, 'music.json');

module.exports = {
  config: {
    name: "guessmusic",
    version: "1.0",
    author: "Kshitiz",
    role: 0,
    shortDescription: "Guess the music ",
    longDescription: "Listen to a song and guess its name.",
    category: "game",
    guide: {
      en: "{p}guessmusic // top"
    }
  },

  onStart: async function ({ event, message, usersData, api }) {
    const subCommand = event.body.split(' ')[1];
    if (subCommand === 'top') {
      return await this.showTopPlayers({ event, message, usersData, api });
    }

    try {
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      const musicData = await fetchMusic();
      if (!musicData) {
        return message.reply("Failed to fetch music data. Please try again later.");
      }

      const { music_name, options, correct_answer } = musicData;
      const query = music_name;
      const searchResults = await yts(query);

      if (!searchResults.videos.length) {
        return message.reply("Error: Song not found.");
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;
      const stream = ytdl(videoUrl, { filter: "audioonly" });
      const fileName = `music.mp3`;
      const filePath = `${__dirname}/tmp/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
      });

      stream.on('end', async () => {
        console.info('[DOWNLOADER] Downloaded');
        const optionsString = Object.entries(options).map(([key, value]) => `${key.toUpperCase()}. ${value}`).join('\n');
        const audiobody = `
Guess the music Name
Options:
${optionsString}
`;
        const replyMessage = { body: audiobody, attachment: fs.createReadStream(filePath) };

        const sentMessage = await message.reply(replyMessage);
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: this.config.name,
          messageID: sentMessage.messageID,
          correctAnswer: correct_answer
        });


        const userID = event.senderID;
        await saveUserData(userID, { gameActive: true });
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("An error occurred while processing the request.");
    }
  },

  onReply: async function ({ message, event, Reply, api }) {
    try {
      const userID = event.senderID;
      const userAnswer = event.body.trim().toUpperCase();
      const correctAnswer = Reply.correctAnswer.toUpperCase();


      const userData = await getUserData(userID);
      if (!userData || !userData.gameActive) {
        return; 
      }

      if (userAnswer === correctAnswer) {
        await addCoins(userID, 1000);
        await message.reply("🎉🎊 Congratulations! Your answer is correct. You have received 1000 coins.");
      } else {
        await message.reply(`🥺 Oops! Wrong answer. The correct answer was: ${correctAnswer}`);
      }


      await saveUserData(userID, { gameActive: false });


      await api.unsendMessage(event.messageID);
      const { commandName, messageID } = Reply;
      if (commandName === this.config.name) {
        await api.unsendMessage(messageID);
      }
    } catch (error) {
      console.error("Error while handling user reply:", error);
    }
  },

  showTopPlayers: async function ({ event, message, usersData, api }) {
    try {
      const topUsers = await getTopUsers(usersData, api);
      if (topUsers.length === 0) {
        return message.reply("No players found.");
      }

      let reply = "Top 5 players based on coins earned:\n";
      topUsers.slice(0, 5).forEach((player, index) => {
        reply += `${index + 1}. ${player.username} - ${player.money} coins\n`;
      });

      await message.reply(reply);
    } catch (error) {
      console.error("Error while showing top players:", error);
      message.reply("An error occurred while processing the request.");
    }
  }
};

async function fetchMusic() {
  try {
    const response = await axios.get('https://guess-music.vercel.app/kshitiz');
    return response.data;
  } catch (error) {
    console.error("Error fetching music data:", error);
    return null;
  }
}

async function addCoins(userID, amount) {
  let userData = await getUserData(userID);
  if (!userData) {
    userData = { money: 0 };
  }
  userData.money += amount;
  await saveUserData(userID, userData);
}

async function getUserData(userID) {
  try {
    const data = await fs.readFile(userDataFilePath, 'utf8');
    const userData = JSON.parse(data);
    return userData[userID];
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(userDataFilePath, '{}');
      return null;
    } else {
      console.error("Error reading user data:", error);
      return null;
    }
  }
}

async function saveUserData(userID, data) {
  try {
    const userData = await getUserData(userID) || {};
    const newData = { ...userData, ...data };
    const allUserData = await getAllUserData();
    allUserData[userID] = newData;
    await fs.writeFile(userDataFilePath, JSON.stringify(allUserData, null, 2), 'utf8');
  } catch (error) {
    console.error("Error saving user data:", error);
  }
}

async function getAllUserData() {
  try {
    const data = await fs.readFile(userDataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading user data:", error);
    return {};
  }
}

async function getTopUsers(usersData, api) {
  try {
    const allUserData = await getAllUserData();
    const userIDs = Object.keys(allUserData);
    const topUsers = [];


    const getUserInfoPromisified = util.promisify(api.getUserInfo);


    await Promise.all(userIDs.map(async (userID) => {
      try {
        const userInfo = await getUserInfoPromisified(userID);
        const username = userInfo[userID].name;
        if (username) {
          const userData = allUserData[userID];
          topUsers.push({ username, money: userData.money });
        }
      } catch (err) {
        console.error("Failed to retrieve user information:", err);
      }
    }));


    topUsers.sort((a, b) => b.money - a.money);

    return topUsers;
  } catch (error) {
    console.error("Error getting top users:", error);
    return [];
  }
        }
