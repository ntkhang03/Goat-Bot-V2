const axios = require('axios');
const cheerio = require('cheerio');

async function getWeather(location) {
  const url = `https://www.google.com/search?q=weather+${location}`;
  const headers = { "User-Agent": "Mozilla/5.0" };

  try {
    const response = await axios.get(url, { headers });
    const html = response.data;
    const $ = cheerio.load(html);

    const weatherInfo = $(".BNeawe.iBp4i.AP7Wnd").first().text();

    return weatherInfo;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return "Could not retrieve weather data";
  }
}

module.exports = {
  config: {
    name: "weather",
    version: "1.0",
    author: "Your Name",
    role: 0,
    category: "utility",
    description: "Gets the weather information for a specified location.",
    guide: {
      vi: "Không có sẵn",
      en: "Usage: .weather {location}"
    }
  },

  onStart: async function ({ bot, message, args }) {
    if (args.length === 0) {
      message.reply("Please provide a location.");
      return;
    }

    const location = args.join(" ");
    const weatherInfo = await getWeather(location);
    message.reply(`Weather in ${location}: ${weatherInfo}`);
  }
};
