const { getStreamFromURL } = global.utils;
const axios = require("axios");

const API = 'https://anime-api.shahadat2006hh.workers.dev';
const URL_SHORTENER_API = 'https://url6-9.onrender.com';
const API_KEY = 'rehat-gay';

module.exports = {
  config: {
    name: "anime",
    aliases: ["anime"],
    version: "1.0",
    author: "shahadat20066",
    countDown: 5,
    role: 0,
    shortDescription: "Get anime data",
    longDescription: "Search and get anime info",
    category: "anime",
    guide: {
      en: "{pn} popular\n{pn} search <name>\n\nExample:\n{pn} popular\n{pn} search Naruto"
    }
  },

  onStart: async function ({ message, args, event }) {
    if (args.length === 0) {
      return message.reply(`⚠ | Please enter a command!`);
    }

    const command = args[0];
    const query = args.slice(1).join(" ");
    
    try {
      if (command.toLowerCase() === 'popular') {
        const res = await axios.get(`${API}/gogoPopular/1`);
        const animeList = res.data.results.slice(0, 6);

        if (animeList.length === 0) {
          return message.reply(`🥺 Not Found`);
        }

        let replyText = "===「 Popular Anime 」===\n\nReply the number which anime info you want to see\n\n";
        for (let i = 0; i < animeList.length; i++) {
          const anime = animeList[i];
          replyText += `${i + 1}. 🔰 Title: ${anime.title}\n    🗓️ ${anime.releaseDate}\n\n`;
        }

        const form = {
          body: replyText,
          attachment: await Promise.all(animeList.map(anime => getStreamFromURL(anime.image)))
        };

        message.reply(form, async (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: 'searchResults',
              data: animeList
            });
          }
        });

      } else if (command.toLowerCase() === 'search') {
        if (!query) {
          return message.reply(`⚠ | Please enter anime name to search!`);
        }

        const res = await axios.get(`${API}/search/${query}`);
        const animeList = res.data.results.slice(0, 6);

        if (animeList.length === 0) {
          return message.reply(`🥺 Not Found`);
        }

        let replyText = `===「 Anime search result for: ${query} 」===\n\nReply the number which anime info you want to see\n\n`;
        for (let i = 0; i < animeList.length; i++) {
          const anime = animeList[i];
          replyText += `${i + 1}. 🔰 Title: ${anime.title}\n    🗓️ ${anime.releaseDate}\n\n`;
        }

        const form = {
          body: replyText,
          attachment: await Promise.all(animeList.map(anime => getStreamFromURL(anime.img)))
        };

        message.reply(form, async (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: 'searchResults',
              data: animeList
            });
          }
        });

      } else {
        return message.reply(`⚠ | Invalid command!`);
      }

    } catch (e) {
      message.reply(`🥺 Not Found`);
      console.error(e.message);
    }
  },

  onReply: async function ({ message, event, Reply, args }) {
    const { author, type, data, animeId, totalEp } = Reply;
    if (event.senderID !== author) return;

    const selectedIndex = parseInt(args[0], 10) - 1;
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= data.length) {
      return message.reply(`⚠ | Invalid selection!`);
    }

    const selectedAnime = data[selectedIndex];

    try {
      if (type === 'searchResults') {
        const res = await axios.get(`${API}/anime/${selectedAnime.id}`);
        const animeInfo = res.data.results;
        const episodes = animeInfo.episodes;

        let replyText = `===「 Anime Info 」===\n\n🔰 Name: ${animeInfo.name}\n🆎 Type: ${animeInfo.type}\n🎭 Genre: ${animeInfo.genre}\n📅 Release: ${animeInfo.released}\n📊 Status: ${animeInfo.status}\n🔠 Other name: ${animeInfo.other_name}\n📖 Total Episodes: ${episodes.length}\n🗒 ️Plot summary: ${animeInfo.plot_summary}\n\n(Reply the episode number which episode you want to get the download links.)`;

        const form = {
          body: replyText,
          attachment: await getStreamFromURL(animeInfo.image)
        };

        message.reply(form, async (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: 'animeInfo',
              data: episodes,
              animeId: selectedAnime.id,
              totalEp: episodes.length,
              infoImg: animeInfo.image
            });
          }
        });

      } else if (type === 'animeInfo') {
        const episodeNumber = parseInt(args[0], 10);
        if (isNaN(episodeNumber) || episodeNumber < 1 || episodeNumber > totalEp) {
          return message.reply(`⚠ | Please enter a valid episode number!`);
        }

        const episodeId = `${animeId}-episode-${episodeNumber}`;

        const res = await axios.get(`${API}/download/${episodeId}`);
        const downloadLinks = res.data.results;

        let replyText = `Here is your episode ${episodeNumber} download link senpai\n\n(Reply the episode number on the previous message which episode you want to get the download links again)\n\n`;
        const qualities = ['640x360', '854x480', '1280x720', '1920x1080'];

        for (const quality of qualities) {
          if (downloadLinks[quality]) {
            const url = downloadLinks[quality];
            const shortRes = await axios.get(`${URL_SHORTENER_API}/?url=${encodeURIComponent(url)}&apikey=${API_KEY}`);
            replyText += `${quality}: ${shortRes.data.shortUrl}\n\n`;
          }
        }

        message.reply(replyText, async (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: 'downloadLinks',
              data: downloadLinks,
              animeId: animeId,
              totalEp: totalEp
            });
          }
        });
      }
    } catch (e) {
      message.reply(`🥺 An error occurred`);
      console.error(e.message);
    }
  }
};

async function search(query) {
  const url = `${API}/search/${query}`;
  const response = await axios.get(url);
  return response.data;
};

async function getInfo(id) {
  const url = `${API}/anime/${id}`;
  const response = await axios.get(url);
  return response.data;
};

async function watch(id) {
  const url = `${API}/episode/${id}`;
  const response = await axios.get(url);
  return response.data;
}

async function download(id) {
  const url = `${API}/download/${id}`;
  const response = await axios.get(url);
  return response.data;
}
