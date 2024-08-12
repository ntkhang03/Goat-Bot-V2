module.exports = {
  config: {
    name: "profilepicture",
    aliases: ["pfp"],
    version: "1.0",
    author: "Shikaki",
    role: 0,
    shortDescription: "Get user avatar",
    longDescription: "Get user avatar by mentioning or UID",
    category: "image",
  },

  onStart: async function ({ event, message, usersData, api, args, getLang }) {
    let uid;

    if (args[0]) {
      
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) {
          uid = match[1];
        }
      }
    }

    if (!uid) {
      
      uid = event.type === "message_reply" ? event.messageReply.senderID : Object.keys(event.mentions)[0] || event.senderID;
    }

    const avatarUrl = await usersData.getAvatarUrl(uid);
    
    message.reply({
      attachment: await global.utils.getStreamFromURL(avatarUrl)
    });
  }
};
