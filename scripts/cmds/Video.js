module.exports = {
  config: {
    name: "video",
    aliases: [],
    version: "1.1",
    author: "kshitiz",//respect author dont change
    countDown: 5,
    role: 0,
    shortDescription: "structure for category baed videos",
    longDescription: "your actual discription",
    category: "add category",
    guide: "{p}{n} category",
  },

  sentVideos: {
    naruto: [],
    bleach: [],
    onepiece: [],
                  // Add more categories as needed like naruto bleach onepiece
  },

  videos: {
    naruto: [
      "https://drive.google.com/uc?export=download&id=1OP2zmycLmFihRISVLzFwrw__LRBsF9GN",
      "",
      "",
      "",
                                                                     // Add m video links here like this 
    ],
    bleach: [
      "https://drive.google.com/uc?export=download&id=1bds-i6swtqi2k4YCoglPKTV7kL7f-SF7",
      "",
      "",
      "",
                                                               // Add more  video links here
    ],
    onepiece: [
      "https://drive.google.com/uc?export=download&id=1QaK3EfNmbwAgpJm4czY8n8QRau9MXoaR",
      
                                                               // Add more  video links here
    ],
                                         // Add more categories and video links as needed ex:-  video: [
                                                                                        //        "vdo link",
  },

  onStart: async function ({ api, event, message, args }) {
    const senderID = event.senderID;

    const loadingMessage = await message.reply({
      body: "Loading random anime video... Please wait! 🕐", // change this loading msg
    });

    if (args.length === 0) {
      api.unsendMessage(loadingMessage.messageID);
      return message.reply({
        body: `Please specify a category. Available categories: ${Object.keys(this.videos).join(", ")}`,
      });
    }

    const category = args[0].toLowerCase();

    if (!this.videos.hasOwnProperty(category)) {
      api.unsendMessage(loadingMessage.messageID);
      return message.reply({
        body: `Invalid category. Available categories: ${Object.keys(this.videos).join(", ")}`,
      });
    }

    const availableVideos = this.videos[category].filter(video => !this.sentVideos[category].includes(video));

    if (availableVideos.length === 0) {
      this.sentVideos[category] = [];
    }

    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const randomVideo = availableVideos[randomIndex];

    this.sentVideos[category].push(randomVideo);

    if (senderID !== null) {
      message.reply({
        body: `Enjoy the ${category} video... 🤍`,  // this is video body change this if you want
        attachment: await global.utils.getStreamFromURL(randomVideo),
      });

      setTimeout(() => {
        api.unsendMessage(loadingMessage.messageID);
      }, 5000);  // its a time that unsend loading msg you can increase it 
    }
  },
};


/* guid to generate drive link
1. upload your video on drive
2. make the video acces anyone with the link 
3. first upload all video and you can select all video and change access to anyone with the link for saving time
4. now one by one copy link of video and go to website drive direct link converter 
5. paste the link copy direct link and paste that in code continue like  this 
*/
