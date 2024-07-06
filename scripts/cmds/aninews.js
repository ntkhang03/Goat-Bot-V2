const malScraper = require('mal-scraper');

module.exports = {
  config: {
    name: "aninews",
    aliases: ["animenews"],
    version: "1.0",
    author: "Samir",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "get latest news of anime from MyAnimeList"
    },
    longDescription: {
      en: "get latest news of anime from MyAnimeList"
    },
    category: "Anime",
    guide: {
      en: "{p}malnews"
    }
  },
  onStart: async function ({ api, event }) {
    const nbNews = 5;

    malScraper.getNewsNoDetails(nbNews)
      .then((n) => api.sendMessage(
        "TOP 5 LATEST MAL NEWS\n\n『 1 』" + n[0].title + "\n\n『 2 』" + n[1].title + "\n\n『 3 』" + n[2].title + "\n\n『 4 』" + n[3].title + "\n\n『 5 』" + n[4].title,
        event.threadID,
        event.messageID
      ))
      .catch((err) => {
        console.error(err);
        api.sendMessage("Sorry, something went wrong while fetching the news.", event.threadID);
      });
  }
};
