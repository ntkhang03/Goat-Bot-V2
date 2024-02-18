const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
    config: {
        name: "instagram",
        version: "1.1",
        author: "AceGun",
        countDown: 5,
        role: 0,
        shortDescription: "Download Instagram video",
        longDescription: "Download Instagram video's, story, reels, photo etc.",
        category: "media",
        guide: "{pn} <insta link>\n\nApi provided by SamirŒ"
    },

    onStart: async function ({ api, event, args }) {
        const link = args[0];

        if (!link) {
            api.sendMessage("😏 | Please provide a valid Instagram link.", event.threadID, event.messageID);
            return;
        }

        api.sendMessage("⏳ | Downloading video, please wait...", event.threadID, event.messageID);

        try {
            const response = await axios.get(`https://bnw.samirzyx.repl.co/insta?url=${encodeURIComponent(link)}`);
            console.log("API Response:", response.data);

            const videoData = response.data.data.data;

            if (videoData && videoData.length > 0 && videoData[0].url) {
                const videoURL = videoData[0].url;
                const path = __dirname + `/cache/instagram_video.mp4`;

                try {
                    const videoResponse = await axios.get(videoURL, { responseType: "arraybuffer" });
                    fs.writeFileSync(path, Buffer.from(videoResponse.data, 'binary'));

                    if (fs.existsSync(path)) {
                        api.sendMessage({
                            body: "😋 | Here's your video",
                            attachment: fs.createReadStream(path)
                        }, event.threadID, () => {
                            fs.unlinkSync(path);
                            console.log(`Deleted temporary file: ${path}`);
                        }, event.messageID);
                    } else {
                        throw new Error("Downloaded file does not exist");
                    }
                } catch (writeError) {
                    console.error("Error writing video file:", writeError);
                    throw new Error("Error writing video file");
                }
            } else {
                throw new Error("Invalid response format or missing video URL");
            }
        } catch (error) {
            console.error("Error fetching Instagram video:", error);
            api.sendMessage(`🥴 | Error fetching Instagram video. Please try again later.`, event.threadID, event.messageID);
        }
    }
};
