const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");

const jsonFilePath = path.join(__dirname, "sentVideos.json");
global.sentVideos = global.sentVideos || loadSentVideos();

const pages = {
  animenepal: {
    id: "animemenepal",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  naos: {
    id: "naos011",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  truth: {
    id: "manojthapa0",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  animeworld: {
    id: "animeworld48",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  anmc: {
    id: "animeaesthetic2",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  horny: {
    id: "HORNYSTATION2",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  meme: {
    id: "WalterWhitebhai",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  mpn: {
    id: "moodpostingsnepal",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  nepmeme: {
    id: "BatWala100",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  lev: {
    id: "bhawanaofficialpage",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  gio: {
    id: "Gioofficial.ph",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  tian: {
    id: "Tianguitar",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  ninetys: {
    id: "Ussteam03",
    accessToken: "EAAD6V7os0gcBOzHzZAPuxErF5MeZA1e1nDLsFm0QlIdS0n0XFzL3t1qUUdXokxsBZBdSQZAdZArTEUzXfNsfHTptUBBM0aeN6iVvorhnqJcSXTXArYZBFWs69ZCJA6QdZCyZAYt5d5ZAV2ceagZCZB2AIfk8MC3rZAJ96HCO11yNTGZCko31DRtvzyoJMiWBpK9SWU2RxZASAZDZD",
  },
  // Add more pages as needed
};

module.exports = {
  config: {
    name: "page",
    aliases: ["p"],
    version: "1.0",
    author: "kshitiz",
    countDown: 5,
    role: 0,
    shortDescription: "",
    longDescription: "Get a random video from the specified page",
    category: "𝗙𝗕𝗣𝗔𝗚𝗘",
    guide: "{p}{n} pageName",
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (!args[0]) {
        const availablePages = Object.keys(pages).join(", ");
        return api.sendMessage(`Please specify a page name. Available pages: ${availablePages}`, event.threadID);
      }

      const loadingMessage = await api.sendMessage(
        `Loading a random video from the page "${args[0]}", please wait...`,
        event.threadID
      );

      const pageName = args[0].toLowerCase();

      if (!pages[pageName]) {
        const availablePages = Object.keys(pages).join(", ");
        return api.sendMessage(`Page "${pageName}" not found. Available pages: ${availablePages}`, event.threadID);
      }

      const { id, accessToken } = pages[pageName];

      const response = await axios.get(`https://graph.facebook.com/${id}/videos?access_token=${accessToken}`);
      const videos = response.data.data;

      if (videos.length > 0) {
        const unsentVideos = videos.filter((video) => !global.sentVideos[pageName]?.includes(video.id));

        if (unsentVideos.length === 0) {
          await api.sendMessage("All videos from the page have been sent before.", event.threadID);
        } else {
          const randomVideo = unsentVideos[Math.floor(Math.random() * unsentVideos.length)];
          const videoLink = randomVideo.source;
          const videoId = randomVideo.id;

          const tempDir = path.join(os.tmpdir(), "fb_videos");
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
          }

          const randomFileName = `video_${Date.now()}.mp4`;
          const filePath = path.join(tempDir, randomFileName);

          const videoResponse = await axios({
            method: "GET",
            url: videoLink,
            responseType: "stream",
          });

          videoResponse.data.pipe(fs.createWriteStream(filePath));

          videoResponse.data.on("end", async () => {
            if (fs.existsSync(filePath)) {
              await api.sendMessage(
                {
                  body: `Random video from the page "${pageName}":`,
                  attachment: fs.createReadStream(filePath),
                },
                event.threadID
              );

           
              markVideoAsSent(pageName, videoId);

            
              saveSentVideos();
            } else {
              console.error("File does not exist:", filePath);
              await api.sendMessage(
                "An error occurred while fetching the video. Please try again later.",
                event.threadID
              );
            }

            api.unsendMessage(loadingMessage.messageID);
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
      } else {
        await api.sendMessage(`No videos found on the page "${pageName}".`, event.threadID);
        api.unsendMessage(loadingMessage.messageID);
      }
    } catch (error) {
      console.error("Error retrieving videos:", error);
      await api.sendMessage("An error occurred while retrieving videos.", event.threadID);
    }
  },
};

function loadSentVideos() {
  try {
    if (fs.existsSync(jsonFilePath)) {
      const fileContent = fs.readFileSync(jsonFilePath, "utf-8");
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error loading sent videos:", error);
  }

  return {};
}

function markVideoAsSent(pageName, videoId) {
  global.sentVideos[pageName] = global.sentVideos[pageName] || [];
  global.sentVideos[pageName].push(videoId);
}

function saveSentVideos() {
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(global.sentVideos), "utf-8");
  } catch (error) {
    console.error("Error saving sent videos:", error);
  }
}
