const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "owner",
    aliases: [],
    author: "aminul",// idea and half code stolen from mirai coded by Rickiel haha
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "get bot owner info"
    },
    category: "owner",
    guide: {
      en: "{p}{n}"
    }
  },
  onStart: async function ({ api, event }) {
      try {
        const loadingMessage = "𝐋𝐨𝐝𝐢𝐧𝐠 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐅𝐨𝐫𝐌𝐚𝐭𝐢𝐨𝐧...";
        await api.sendMessage(loadingMessage, event.threadID);

        const ownerInfo = {
          name: '★>𝐀𝐦𝐢𝐧𝐮𝐥 𝐒𝐨𝐫𝐝𝐚𝐫 <★',
          gender: '𝐌𝐚𝐥𝐞',
          hobby: '𝐏𝐫𝐞𝐟𝐞𝐜𝐭 𝐁𝐨𝐲',
          relationship: '𝐒𝐢𝐧𝐠𝐥𝐞 𝐏𝐫𝐨 𝐌𝐚𝐱',
          facebookLink: 'https://www.facebook.com/profile.php?id=100071880593545',
          bio: '𝑯𝒂𝒕𝒆𝒓𝒔 𝒂𝒓𝒆 𝒎𝒚 𝒎𝒐𝒕𝒊𝒗𝒂𝒕𝒐𝒓𝒔'
        };

        const videoUrl = 'https://i.imgur.com/Ulhw14t.mp4';
        const tmpFolderPath = path.join(__dirname, 'tmp');

        if (!fs.existsSync(tmpFolderPath)) {
          fs.mkdirSync(tmpFolderPath);
        }

        const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
        const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');

        fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

        const response = `
          𝗼𝘄𝗻𝗲𝗿 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻:
          𝐍𝐚𝐦𝐞: ${ownerInfo.name}
          𝐆𝐞𝐧𝐝𝐞𝐫: ${ownerInfo.gender}
          𝐇𝐨𝐛𝐛𝐲: ${ownerInfo.hobby}
          𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩: ${ownerInfo.relationship}
          𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤: ${ownerInfo.facebookLink}
          𝐒𝐭𝐚𝐭𝐮𝐬: ${ownerInfo.bio}
        `;

        await api.sendMessage({
          body: response,
          attachment: fs.createReadStream(videoPath)
        }, event.threadID);
      } catch (error) {
        console.error('Error in owner command:', error);
        api.sendMessage('An error occurred while processing the command.', event.threadID);
      }
    },
    onChat: async function({ api, event }) {
      try {
        const lowerCaseBody = event.body.toLowerCase();
        
        if (lowerCaseBody === "owner" || lowerCaseBody.startsWith("{p}owner")) {
          await this.onStart({ api, event });
        }
      } catch (error) {
        console.error('Error in onChat function:', error);
      }
    }
  };

/*

To add new video 
1. upload your video on drive
2. after uploading change the video acces to anyone with the link 
3. copy video link
4. go to direct drive link convert website
5. paste that link there and copy direct link
6. paste that link in code 

*/
