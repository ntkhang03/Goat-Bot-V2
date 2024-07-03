const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  config: {
    name: "xvid",
    version: "1.0",
    author: "hedroxyy",
    role: 2,
    aliases: ["xv", "pornsearch"],
    category: "18+",
    description: "Search Pornhub and return the specified number of unique video links.",
    guide: {
      vi: "Không có sẵn",
      en: "Usage: .xvid {query} {number of links (optional)}"
    }
  },

  onStart: async function ({ api, event, args }) {
    if (args.length === 0) {
      api.sendMessage("Usage: .xvid {query} {number of links (optional)}", event.threadID, event.messageID);
      return;
    }

    let numLinks = 1; // Default number of links
    const lastArg = args[args.length - 1];

    if (!isNaN(lastArg) && lastArg > 0) {
      numLinks = parseInt(lastArg, 10);
      args.pop();
    }

    const query = args.join(' ');

    const searchUrl = `https://www.pornhub.com/video/search?search=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(searchUrl);
      const $ = cheerio.load(response.data);

      const results = new Set(); // Using a Set to store unique links

      $('ul.videos.search-video-thumbs li div.wrap a').each((index, element) => {
        if (results.size < numLinks) { // Limit to the specified number of links
          const videoLink = `https://www.pornhub.com${$(element).attr('href')}`;
          if (!videoLink.includes("/channels/") && !videoLink.includes("/model/")) { // Exclude channel and model URLs
            const videoTitle = $(element).attr('title');
            results.add(`🔍 | ${videoTitle}\n🔗 | Link: ${videoLink}`);
          }
        }
      });

      if (results.size > 0) {
        api.sendMessage(Array.from(results).join('\n\n'), event.threadID, event.messageID);
      } else {
        api.sendMessage("❌ | No results found.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ | An error occurred while searching.", event.threadID, event.messageID);
    }
  }
};
