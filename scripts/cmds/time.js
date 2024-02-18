 const axios = require('axios');

module.exports = {
  config: {
    name: "time",
    aliases: [],
    author: "kshitiz",  
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "know the time zone of any city"
    },
    category: "info",
    guide: {
      en: "{p}{n} name of city"
    }
  },
  onStart: async function ({ api, event, args }) {
    
    const cityName = args.join(' ');

    if (!cityName) {
      api.sendMessage("Please provide the name of a city.", event.threadID, event.messageID);
      return;
    }

   
    try {
      const apiKey = '0Hr3RnpBTgQvQ9np4ibDrQ==CkYJq9yAT5yk6vIn'; // add your own apikey
      const apiUrl = `https://api.api-ninjas.com/v1/worldtime?city=${encodeURIComponent(cityName)}`;
      const response = await axios.get(apiUrl, { headers: { 'X-Api-Key': apiKey } });

    
      const { timezone, datetime, day_of_week, year, month } = response.data;

   
      const currentTime = datetime.split(' ')[1]; 
      const message = `𝗧𝗜𝗠𝗘𝗭𝗢𝗡𝗘 𝗢𝗙: ${timezone}\n 𝗰𝘂𝗥𝗥𝗘𝗡𝗧 𝗧𝗜𝗠𝗘: ${currentTime}\n 𝘆𝗲𝗮𝗿:${year}\n 𝗺𝗼𝗻𝘁𝗵:${month}\n 𝗱𝗮𝘆: ${day_of_week}`;
      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
 
      api.sendMessage("Error fetching time information\d your own api key in code", event.threadID, event.messageID);
    }
  },
};

/*
in future if code stop working 
add your own apikey in code there is guide
you can get apikey from ninja pai web
*/
