const axios = require("axios");
const fs = require('fs-extra');
const path = require('path');
const { getStreamFromURL, shortenURL, randomString } = global.utils;

async function video(api, event, args, message) {
    api.setMessageReaction("🕢", event.messageID, (err) => {}, true);
    try {
        let title = '';
        let shortUrl = '';

        const extractShortUrl = async () => {
            const attachment = event.messageReply.attachments[0];
            if (attachment.type === "video" || attachment.type === "audio") {
                return attachment.url;
            } else {
                throw new Error("Invalid attachment type.");
            }
        };

        let videoId = '';
        if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
            shortUrl = await extractShortUrl();
            const musicRecognitionResponse = await axios.get(`https://youtube-music-sooty.vercel.app/kshitiz?url=${encodeURIComponent(shortUrl)}`);
            title = musicRecognitionResponse.data.title;
            const searchResponse = await axios.get(`https://youtube-kshitiz.vercel.app/youtube?search=${encodeURIComponent(title)}`);
            if (searchResponse.data.length > 0) {
                videoId = searchResponse.data[0].videoId;
            }
          
            shortUrl = await shortenURL(shortUrl);
        } else if (args.length === 0) {
            message.reply("Please provide a video name or reply to a video or audio attachment.");
            return;
        } else {
            title = args.join(" ");
            const searchResponse = await axios.get(`https://youtube-kshitiz.vercel.app/youtube?search=${encodeURIComponent(title)}`);
            if (searchResponse.data.length > 0) {
                videoId = searchResponse.data[0].videoId;
            }
          
            const videoUrl = await axios.get(`https://youtube-kshitiz.vercel.app/download?id=${encodeURIComponent(videoId)}`);
            if (videoUrl.data.length > 0) {
                shortUrl = await shortenURL(videoUrl.data[0]);
            }
        }

        if (!videoId) {
            message.reply("No video found for the given query.");
            return;
        }

        const downloadResponse = await axios.get(`https://youtube-kshitiz.vercel.app/download?id=${encodeURIComponent(videoId)}`);
        if (downloadResponse.data.length === 0) {
            message.reply("Failed to retrieve download link for the video.");
            return;
        }

        const videoUrl = downloadResponse.data[0];
        const writer = fs.createWriteStream(path.join(__dirname, "cache", `${videoId}.mp4`));
        const response = await axios({
            url: videoUrl,
            method: 'GET',
            responseType: 'stream'
        });

        response.data.pipe(writer);

        writer.on('finish', () => {
            const videoStream = fs.createReadStream(path.join(__dirname, "cache", `${videoId}.mp4`)); 
            message.reply({ body: `📹 Playing: ${title}\nDownload Link: ${shortUrl}`, attachment: videoStream });
            api.setMessageReaction("✅", event.messageID, () => {}, true);
        });

        writer.on('error', (error) => {
            console.error("Error:", error);
            message.reply("error");
        });
    } catch (error) {
        console.error("Error:", error);
        message.reply("error");
    }
}

module.exports = {
    config: {
        name: "video", 
        version: "1.0",
        author: "Kshitiz",
        countDown: 10,
        role: 0,
        shortDescription: "play video from youtube",
        longDescription: "play video from youtube support audio recognition.",
        category: "music",
        guide: "{p} video videoname / reply to audio or video" 
    },
    onStart: function ({ api, event, args, message }) {
        return video(api, event, args, message);
    }
};
