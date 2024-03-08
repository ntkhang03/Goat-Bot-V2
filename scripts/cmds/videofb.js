const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

//get video id
async function process_url(url) {
  try {
    if (url.startsWith('fb.watch/')) {
      url = 'https://' + url;
    } else if (url.startsWith('https://fb.watch/')) {
    } else if (url.includes('www.facebook.com/watch/') || url.includes('www.facebook.com/reel/') || url.includes('www.facebook.com/groups/') || url.includes('facebook.com/watch/') || url.includes('facebook.com/reel/') || url.includes('facebook.com/groups/')) {
      const idMatch = url.match(/(\d+)/);
      if (idMatch) {
        url = `https://facebook.com/${idMatch[0]}`; 
      } 
    } else if (url.includes('www.facebook.com/')) { 
      url = url.replace('www.facebook.com', 'm.facebook.com'); 
    }
    
    const response = await axios.head(url, { maxRedirects: 0 });
    if (response.headers.location) {
      let rd_url = response.headers.location;
      rd_url = rd_url.replace('www.facebook.com', 'm.facebook.com');
      return rd_url;
    } else {
      return url;
    }
  } catch (error) {
    if (error.response && error.response.status >= 300 && error.response.status < 400 && error.response.headers.location) {
      let rd_url = error.response.headers.location;
      rd_url = rd_url.replace('www.facebook.com', 'm.facebook.com');
      return rd_url;
    } else {
      throw error;
    }
  }
}

//scrape title and video stream url
async function scrape_info(url) {
  try {
    const read_cookies = fs.readFileSync('account.txt', 'utf8');
    const cookies = JSON.parse(read_cookies);
    const format_cookie = {};
    for (const cookie of cookies) { format_cookie[cookie.key] = cookie.value; }
    const final_url = await process_url(url);
    const response = await axios.get(final_url, { headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "cache-control": "max-age=0",
      "dpr": "2.625",
      "sec-ch-prefers-color-scheme": "dark",
      "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\"",
      "sec-ch-ua-full-version-list": "\"Not_A Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"120.0.6099.116\"",
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-model": "\"SM-S918B/DS\"",
      "sec-ch-ua-platform": "\"Android\"",
      "sec-ch-ua-platform-version": "\"13.0.0\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "viewport-width": "980",
      "cookie": Object.entries(format_cookie).map(([key, value]) => `${key}=${value}`).join('; ')
    }});
    const $ = cheerio.load(response.data);
    let fb_title = '';
    let media_url = '';
    $('p').each(function() {
      fb_title = $(this).text().trim();
      if (fb_title) {
        return false;
      }
    });
    $('a').each(function() {
      const href = $(this).attr('href');
      if (href && href.includes('video')) {
        media_url = href.replace('/video_redirect/?src=', '');
        media_url = decodeURIComponent(media_url);
        return false;
      }
    });
    return { fb_title, media_url };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  config: {
    name: "videofb",
    version: "1.0",
    author: "tanvir",
    countDown: 10,
    role: 0,
    shortDescription: "fetch video from facebook.",
    longDescription: "fetch video from facebook.",
    category: "video",
    guide: { en: "{pn} [ Facebook URL ]" }
  },

  onStart: async function ({ message, args, event }) {
    const fbUrl = args[0];
    if (!fbUrl) {
      return message.reply(`Please provide a Facebook video URL.`);
    }
    try {
      message.reaction("⏳", event.messageID);
      const processing = message.reply("Downloading video for you")
      const { fb_title, media_url } = await scrape_info(fbUrl);
      if (!media_url) { message.reaction("❌",event.messageID);
      message.unsend((await processing).messageID);
        return message.reply(`failed to fetch video.`);
      }
      message.reply({body: `🎦 ${fb_title || "facebook"}\n\nDownload Link: ${await global.utils.shortenURL(media_url)}`, attachment: await global.utils.getStreamFromURL(media_url)});
      await message.reaction("☑️", event.messageID);
     await message.unsend((await processing).messageID);
    } catch (error) {
      message.reaction("❌", event.messageID);
      console.error(error);
      message.reply(`error: ${error.message}`);
    }
  }
};
