const fs = require('fs-extra');
const axios = require('axios');

module.exports = {
  config: {
    name: "Downloadmp4",
    version: "1.0.0",
    author: "Xyron Chen/ Api by shiki",
    countDown: 0,
    role: 0,
    shortDescription: "Download and send Facebook/Instagram/TikTok/CapCut videos",
    longDescription: "This function allows you to download and send videos from Facebook, Instagram, TikTok, and CapCut.",
    category: "other",
    guide: "{prefix}downloadmp4 <link>"
  },
  
  onStart: async function ({ api, event, args }) {
    const link = args[0];
    if (!link) {
      api.sendMessage("Please provide a valid video link.", event.threadID, event.messageID);
      return;
    }
    api.sendMessage("Downloading video, please wait...", event.threadID, event.messageID);
    try {
      let path = process.cwd() + `/cache/`;
      await fs.ensureDir(path);
      path += 'video.mp4';
      let response;
      let videoURL;
      if (link.startsWith("https://www.facebook.com/")) {
        response = await axios.get(`https://facebookdl.hayih59124.repl.co/facebook?url=${encodeURIComponent(link)}`);
        if (response.data.status !== 200) {
          throw new Error(`Facebook API request failed with code ${response.data.status}`);
        }
        videoURL = response.data.result.sd_q;
      } else if (link.startsWith("https://www.instagram.com/")) {
        response = await axios.get(`https://instagramdl.hayih59124.repl.co/instagram?url=${encodeURIComponent(link)}`);
        if (response.data.status !== 200) {
          throw new Error(`Instagram API request failed with code ${response.data.status}`);
        }
        videoURL = response.data.result[0]._url;
      } else if (link.startsWith("https://www.tiktok.com/")) {
        response = await axios.get(`https://tiktokdl.hayih59124.repl.co/TikTokdl?url=${encodeURIComponent(link)}`);
        if (response.data.status !== 200) {
          throw new Error(`TikTok API request failed with code ${response.data.status}`);
        }
        videoURL = response.data.result.data.play;
      } else if (link.startsWith("https://www.capcut.com/")) {
        response = await axios.get(`https://capcutdl.hayih59124.repl.co/capcut?url=${encodeURIComponent(link)}`);
        if (response.data.status !== 200) {
          throw new Error(`CapCut API request failed with code ${response.data.status}`);
        }
        videoURL = response.data.result.video_ori;
      } else {
        api.sendMessage("Please provide a valid Facebook, Instagram, TikTok, or CapCut link.", event.threadID, event.messageID);
        return;
      }
      const videoData = (await axios.get(videoURL, { responseType: "arraybuffer" })).data;
      await fs.writeFile(path, Buffer.from(videoData, 'utf-8'));
      api.sendMessage({
        body: "Here's your video",
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlink(path, () => {}), event.messageID);
    } catch (error) {
      api.sendMessage(`Error fetching video: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
