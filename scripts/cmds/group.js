const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");

const sentVideos = new Map();

const groupNames = {
  prettysouls: "579133843242227", 
  managementmeme: "1218970378693117",
  relatable: "456847926569537",
  literally: "942254986938304",
  sigma: "742398074285793",
  lev: "254180353715899",
  usbhaius: "351478143529525",
  uss: "1249388862279187",
  corny:"522569259482390",
};

module.exports = {
  config: {
    name: "group",
    aliases: ["fbgroup"],
    version: "1.0",
    role: 0,
    author: "𝗞𝘀𝗵𝗶𝘁𝗶𝘇",
    shortDescription: "Send a random video from a Facebook group",
    longDescription: "Send a random  from a Facebook group",
    category: "𝗙𝗕𝗚𝗥𝗢𝗨𝗣",
    dependencies: {
      axios: "",
    },
  },
  onStart: async function ({ api, event, args }) {
    try {
      const triggerMessageID = event.messageID;
      const loadingMessage = await api.sendMessage(
        "𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁.. ✅",
        event.threadID
      );

      const groupName = args[0] ? args[0].toLowerCase() : null;

      if (!groupName || !groupNames[groupName]) {
        const availableGroups = Object.keys(groupNames).join(", ");
        return api.sendMessage(`Invalid group name. Available groups: ${availableGroups}`, event.threadID, event.messageID);
      }

      const groupId = groupNames[groupName];
      const accessToken = "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD";
      const apiVersion = "v18.0";

      const groupUrl = `https://graph.facebook.com/${apiVersion}/${groupId}/feed?access_token=${accessToken}&fields=attachments{url,type},source`;
      const response = await axios.get(groupUrl);
      const posts = response.data.data || [];
      const videos = posts
        .filter((post) => post.source && typeof post.source === "string")
        .map((post) => post.source);

      if (videos.length === 0) {
        await api.sendMessage(
          `No video links found in the group ${groupName}.`,
          event.threadID,
          loadingMessage.messageID
        );
      } else {
        const unsentVideos = videos.filter(video => !isVideoSent(groupName, video));

        if (unsentVideos.length === 0) {
          await api.sendMessage(
            `All videos from the group ${groupName} have been sent before.`,
            event.threadID,
            loadingMessage.messageID
          );
        } else {
          const randomVideo =
            unsentVideos[Math.floor(Math.random() * unsentVideos.length)] + "&dl=1";

          const tempDir = path.join(os.tmpdir(), "fb_videos");
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
          }

          const randomFileName = `video_${Date.now()}.mp4`;

          const filePath = path.join(tempDir, randomFileName);

          const videoResponse = await axios({
            method: "GET",
            url: randomVideo,
            responseType: "stream",
          });

          videoResponse.data.pipe(fs.createWriteStream(filePath));

          videoResponse.data.on("end", async () => {
            if (fs.existsSync(filePath)) {
              await api.sendMessage(
                {
                  body: `Random video from the group ${groupName}:`,
                  attachment: fs.createReadStream(filePath),
                },
                event.threadID,
                triggerMessageID
              );

              markVideoAsSent(groupName, randomVideo);

              api.unsendMessage(loadingMessage.messageID);
            } else {
              console.error("File does not exist:", filePath);

              await api.sendMessage(
                "An error occurred while fetching the video. Please try again later.",
                event.threadID
              );
            }
          });

          videoResponse.data.on("error", async (err) => {
            console.error("Error during video download:", err);
            await api.sendMessage(
              "An error occurred while fetching the video. Please try again later.",
              event.threadID
            );

            api.unsendMessage(loadingMessage.messageID);
          });
        }
      }
    } catch (error) {
      console.error("Error retrieving videos:", error);
      await api.sendMessage("An error occurred while retrieving videos.", event.threadID);
    }
  },
};

function isVideoSent(groupName, videoLink) {
  return sentVideos.has(groupName) && sentVideos.get(groupName).has(videoLink);
}

function markVideoAsSent(groupName, videoLink) {
  if (!sentVideos.has(groupName)) {
    sentVideos.set(groupName, new Set());
  }
  sentVideos.get(groupName).add(videoLink);
}
