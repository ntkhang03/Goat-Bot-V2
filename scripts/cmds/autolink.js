const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const { getStreamFromURL, shortenURL, randomString } = global.utils;

function loadAutoLinkStates() {
  try {
    const data = fs.readFileSync("autolink.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

function saveAutoLinkStates(states) {
  fs.writeFileSync("autolink.json", JSON.stringify(states, null, 2));
}

let autoLinkStates = loadAutoLinkStates();

module.exports = {
  threadStates: {},
  config: {
    name: 'autolink',
    version: '4.0',
    author: 'Vex_Kshitiz',
    countDown: 5,
    role: 0,
    shortDescription: 'Auto video downloader for Instagram, Facebook, TikTok, Twitter, Pinterest and YouTube',
    longDescription: '',
    category: 'media',
    guide: {
      en: '{p}{n}',
    }
  },
  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    if (!autoLinkStates[threadID]) {
      autoLinkStates[threadID] = 'on'; 
      saveAutoLinkStates(autoLinkStates);
    }

    if (!this.threadStates[threadID]) {
      this.threadStates[threadID] = {};
    }

    if (event.body.toLowerCase().includes('autolink off')) {
      autoLinkStates[threadID] = 'off';
      saveAutoLinkStates(autoLinkStates);
      api.sendMessage("AutoLink is now turned off for this chat.", event.threadID, event.messageID);
    } else if (event.body.toLowerCase().includes('autolink on')) {
      autoLinkStates[threadID] = 'on';
      saveAutoLinkStates(autoLinkStates);
      api.sendMessage("AutoLink is now turned on for this chat.", event.threadID, event.messageID);
    }
  },
  onChat: async function ({ api, event }) {
    const threadID = event.threadID;

    if (this.checkLink(event.body)) {
      const { url } = this.checkLink(event.body);
      console.log(`Attempting to download from URL: ${url}`);
      if (autoLinkStates[threadID] === 'on' || !autoLinkStates[threadID]) {
        this.downLoad(url, api, event);
      } else {
        api.sendMessage("", event.threadID, event.messageID);
      }
      api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    }
  },
  downLoad: async function (url, api, event) {
    const startTime = Date.now();
    const path = __dirname + `/cache/${startTime}.mp4`;

    let estimatedTime = '';
    let videoUrl = '';

    try {
      if (url.includes("instagram")) {
        videoUrl = await this.downloadInstagram(url, api, event, path);
      } else if (url.includes("facebook") || url.includes("fb.watch")) {
        videoUrl = await this.downloadFacebook(url, api, event, path);
      } else if (url.includes("tiktok")) {
        videoUrl = await this.downloadTikTok(url, api, event, path);
      } else if (url.includes("x.com")) {
        videoUrl = await this.downloadTwitter(url, api, event, path);
      } else if (url.includes("pin.it")) {
        videoUrl = await this.downloadPinterest(url, api, event, path);
      } else if (url.includes("youtu")) {
        videoUrl = await this.downloadYouTube(url, api, event, path);
      }

      const endTime = Date.now();
      estimatedTime = ((endTime - startTime) / 1000).toFixed(2) + ' seconds';
    } catch (err) {
      console.error(err);
      api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
      return;
    }

    api.sendMessage(`It Would Probably Take : ${estimatedTime}`, event.threadID, event.messageID);
  },
  downloadInstagram: async function (url, api, event, path) {
    const startTime = Date.now();
    const res = await this.getLink(url, api, event, path);
    const response = await axios({
      method: "GET",
      url: res,
      responseType: "arraybuffer"
    });
    fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
    const endTime = Date.now();
    console.log(`Instagram download completed in ${(endTime - startTime) / 1000} seconds`);

    if (fs.statSync(path).size / 1024 / 1024 > 25) {
      api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
    } else {
      const shortUrl = await shortenURL(res);
      const messageBody = `✅ 🔗 Download Url: ${shortUrl}`;

      api.sendMessage({
        body: messageBody,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    }

    return res;
  },
  downloadFacebook: async function (url, api, event, path) {
    const startTime = Date.now();
    const res = await fbDownloader(url);
    if (res.success && res.download && res.download.length > 0) {
      const videoUrl = res.download[0].url;
      const response = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream"
      });
      if (response.headers['content-length'] > 87031808) {
        api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
      } else {
        response.data.pipe(fs.createWriteStream(path));
        response.data.on('end', async () => {
          const shortUrl = await shortenURL(videoUrl);
          const messageBody = `✅🔗 Download Url: ${shortUrl}`;

          api.sendMessage({
            body: messageBody,
            attachment: fs.createReadStream(path)
          }, event.threadID, () => fs.unlinkSync(path), event.messageID);
        });
      }
    } else {
      api.sendMessage("", event.threadID, event.messageID);
    }
    const endTime = Date.now();
    console.log(`Facebook download completed in ${(endTime - startTime) / 1000} seconds`);

    return res.download[0].url;
  },
  downloadTikTok: async function (url, api, event, path) {
    const startTime = Date.now();
    const res = await axios.get(`https://tikdl-video.vercel.app/tiktok?url=${encodeURIComponent(url)}`);
    if (res.data.videoUrl) {
      const videoUrl = res.data.videoUrl;
      const response = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream"
      });
      if (response.headers['content-length'] > 87031808) {
        api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
      } else {
        response.data.pipe(fs.createWriteStream(path));
        response.data.on('end', async () => {
          const shortUrl = await shortenURL(videoUrl);
          const messageBody = `✅🔗 Download Url: ${shortUrl}`;

          api.sendMessage({
            body: messageBody,
            attachment: fs.createReadStream(path)
          }, event.threadID, () => fs.unlinkSync(path), event.messageID);
        });
      }
    } else {
      api.sendMessage("", event.threadID, event.messageID);
    }
    const endTime = Date.now();
    console.log(`TikTok download completed in ${(endTime - startTime) / 1000} seconds`);

    return res.data.videoUrl;
  },
  downloadTwitter: async function (url, api, event, path) {
    const startTime = Date.now();
    const res = await axios.get(`https://xdl-twitter.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
    const videoUrl = res.data.videoUrl;

    const response = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream"
    });

    if (response.headers['content-length'] > 87031808) {
      api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
    } else {
      response.data.pipe(fs.createWriteStream(path));
      response.data.on('end', async () => {
        const shortUrl = await shortenURL(videoUrl);
        const messageBody = `✅🔗 Download Url: ${shortUrl}`;

        api.sendMessage({
          body: messageBody,
          attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
      });
    }
    const endTime = Date.now();
    console.log(`Twitter download completed in ${(endTime - startTime) / 1000} seconds`);

    return videoUrl;
  },
  downloadPinterest: async function (url, api, event, path) {
    const startTime = Date.now();
    const res = await axios.get(`https://pindl-pinterest.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
    const videoUrl = res.data.url;

    const response = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream"
    });

    if (response.headers['content-length'] > 87031808) {
      api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
    } else {
      response.data.pipe(fs.createWriteStream(path));
      response.data.on('end', async () => {
        const shortUrl = await shortenURL(videoUrl);
        const messageBody = `✅🔗 Download Url: ${shortUrl}`;

        api.sendMessage({
          body: messageBody,
          attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
      });
    }
    const endTime = Date.now();
    console.log(`Pinterest download completed in ${(endTime - startTime) / 1000} seconds`);

    return videoUrl;
  },
  downloadYouTube: async function (url, api, event, path) {
    const startTime = Date.now();
    const res = await axios.get(`https://yt-downloader-eta.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
    const videoUrl = res.data.url;

    const response = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream"
    });

    if (response.headers['content-length'] > 87031808) {
      api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
    } else {
      response.data.pipe(fs.createWriteStream(path));
      response.data.on('end', async () => {
        const shortUrl = await shortenURL(videoUrl);
        const messageBody = `✅🔗 Download Url: ${shortUrl}`;

        api.sendMessage({
          body: messageBody,
          attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
      });
    }
    const endTime = Date.now();
    console.log(`YouTube download completed in ${(endTime - startTime) / 1000} seconds`);

    return videoUrl;
  },
  getLink: function (url, api, event, path) {
    return new Promise((resolve, reject) => {
      if (url.includes("instagram")) {
        axios({
          method: "GET",
          url: `https://insta-kshitiz.vercel.app/insta?url=${encodeURIComponent(url)}`
        })
        .then(res => {
          console.log(`API Response: ${JSON.stringify(res.data)}`);
          if (res.data.url) {
            resolve(res.data.url);
          } else {
            reject(new Error("Invalid response from the API"));
          }
        })
        .catch(err => reject(err));
      } else if (url.includes("facebook") || url.includes("fb.watch")) {
        fbDownloader(url).then(res => {
          if (res.success && res.download && res.download.length > 0) {
            const videoUrl = res.download[0].url;
            resolve(videoUrl);
          } else {
            reject(new Error("Invalid response from the Facebook downloader"));
          }
        }).catch(err => reject(err));
      } else if (url.includes("tiktok")) {
        axios.get(`https://tikdl-video.vercel.app/tiktok?url=${encodeURIComponent(url)}`)
        .then(res => {
          if (res.data.videoUrl) {
            resolve(res.data.videoUrl);
          } else {
            reject(new Error("Invalid response from the TikTok API"));
          }
        })
        .catch(err => reject(err));
      } else {
        reject(new Error("Unsupported platform. Only Instagram, Facebook, and TikTok are supported."));
      }
    });
  },
  queryTikTok: async function (url) {
    try {
      const res = await axios.get("https://ssstik.io/en");
      const s_tt = res.data.split('s_tt = ')[1].split(',')[0];
      const { data: result } = await axios({
        url: "https://ssstik.io/abc?url=dl",
        method: "POST",
        data: qs.stringify({
          id: url,
          locale: 'en',
          tt: s_tt
        }),
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33"
        }
      });

      const $ = cheerio.load(result);
      if (result.includes('<div class="is-icon b-box warning">')) {
        throw {
          status: "error",
          message: $('p').text()
        };
      }

      const allUrls = $('.result_overlay_buttons > a');
      const format = {
        status: 'success',
        title: $('.maintext').text()
      };

      const slide = $(".slide");
      if (slide.length !== 0) {
        const url = [];
        slide.each((index, element) => {
          url.push($(element).attr('href'));
        });
        format.downloadUrls = url;
        return format;
      }

      format.downloadUrls = $(allUrls[0]).attr('href');
      return format;
    } catch (err) {
      console.error('Error in TikTok Downloader:', err);
      return {
        status: "error",
        message: "An error occurred while downloading from TikTok"
      };
    }
  },
  checkLink: function (url) {
    if (
      url.includes("instagram") ||
      url.includes("facebook") ||
      url.includes("fb.watch") ||
      url.includes("tiktok") ||
      url.includes("x.com") ||
      url.includes("pin.it") ||
      url.includes("youtu")
    ) {
      return {
        url: url
      };
    }

    const fbWatchRegex = /fb\.watch\/[a-zA-Z0-9_-]+/i;
    if (fbWatchRegex.test(url)) {
      return {
        url: url
      };
    }

    return null;
  }
};

async function fbDownloader(url) {
  try {
    const response1 = await axios({
      method: 'POST',
      url: 'https://snapsave.app/action.php?lang=vn',
      headers: {
        "accept": "*/*",
        "accept-language": "vi,en-US;q=0.9,en;q=0.8",
        "content-type": "multipart/form-data",
        "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "Referer": "https://snapsave.app/vn",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      data: {
        url
      }
    });

    console.log('Facebook Downloader Response:', response1.data);

    let html;
    const evalCode = response1.data.replace('return decodeURIComponent', 'html = decodeURIComponent');
    eval(evalCode);
    html = html.split('innerHTML = "')[1].split('";\n')[0].replace(/\\"/g, '"');

    const $ = cheerio.load(html);
    const download = [];

    const tbody = $('table').find('tbody');
    const trs = tbody.find('tr');

    trs.each(function (i, elem) {
      const trElement = $(elem);
      const tds = trElement.children();
      const quality = $(tds[0]).text().trim();
      const url = $(tds[2]).children('a').attr('href');
      if (url != undefined) {
        download.push({
          quality,
          url
        });
      }
    });

    return {
      success: true,
      video_length: $("div.clearfix > p").text().trim(),
      download
    };
  } catch (err) {
    console.error('Error in Facebook Downloader:', err);
    return {
      success: false
    };
  }
}
