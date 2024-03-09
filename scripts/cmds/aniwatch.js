const axios = require("axios");
const { getStreamFromURL, shortenURL, randomString } = global.utils;

async function a(animeName) {
  try {
    const response = await axios.get(`https://animee-xhrb.onrender.com/kshitiz?anime=${encodeURIComponent(animeName)}`);
    return response.data.episodes;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch anime episodes");
  }
}

async function b(episodeName) {
  try {
    const response = await axios.get(`https://animedl-pyzi.onrender.com/kshitiz?episode=${encodeURIComponent(episodeName)}`);
    return response.data.downloadLinks;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch episode download links");
  }
}

async function c(episodeName) {
  try {
    const response = await axios.get(`https://stream-blush.vercel.app/kshitiz?id=${encodeURIComponent(episodeName)}`);
    return response.data.Referer;
  } catch (error) {
    console.error("Failed to fetch referer URL:", error.message);
    throw new Error("Failed to fetch referer URL");
  }
}

module.exports = {
  config: {
    name: "aniwatch",
    author: "Kshitiz",
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Watch anime",
    longDescription: "Get anime episode download links",
    category: "Anime",
    guide: "{p}aniwatch <anime_name>",
  },

  onStart: async function ({ api, event, args }) {
    const animeName = args.join(" ");

    if (!animeName) {
      api.sendMessage({ body: "Please provide the name of the anime." }, event.threadID, event.messageID);
      return;
    }

    try {
      const episodes = await a(animeName);

      if (!episodes || episodes.length === 0) {
        api.sendMessage({ body: `No episodes found for the anime: ${animeName}` }, event.threadID, event.messageID);
        return;
      }

      const totalEpisodes = episodes.length;
      const message = `Reply to this message with the episode number.\nTotal Episodes: ${totalEpisodes}`;

      api.sendMessage({ body: message }, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "aniwatch",
          messageID: info.messageID,
          animeName,
          episodes,
        });
      });
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: "Sorry, an error occurred while processing your request." }, event.threadID);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { animeName, episodes } = Reply;

    const episodeIndex = parseInt(args[0], 10);

    if (isNaN(episodeIndex) || episodeIndex <= 0 || episodeIndex > episodes.length) {
      api.sendMessage({ body: "Invalid input.\nPlease provide a valid episode number." }, event.threadID, event.messageID);
      return;
    }

    const selectedEpisode = episodes[episodeIndex - 1];
    const episodeName = selectedEpisode[1];

    try {
      const downloadLinks = await b(episodeName);
      const refererURL = await c(encodeURIComponent(episodeName));
      const shortenedLinks = {
        '1280x720': await shortenURL(downloadLinks['1280x720']),
        '1920x1080': await shortenURL(downloadLinks['1920x1080']),
      };

      const message = `Download links for episode "${episodeName}":\n\n`
        + `1280x720: ${shortenedLinks['1280x720']}\n`
        + `1920x1080: ${shortenedLinks['1920x1080']}\n\n`
        + `Watch online: ${refererURL}`;

      api.sendMessage({ body: message }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: "An error occurred while processing the episode.\nPlease try again later." }, event.threadID);
    } finally {
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};
