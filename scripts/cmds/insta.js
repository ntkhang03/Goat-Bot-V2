const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const request = require('request');

async function fetchInstagramUserInfo(username) {
  const options = {
    method: 'GET',
    url: 'https://instagram130.p.rapidapi.com/account-info',
    params: { username },
    headers: {
      'X-RapidAPI-Key': '0820ec24afmsh10d1bef860c3651p10e3f6jsn715a93754ace',
      'X-RapidAPI-Host': 'instagram130.p.rapidapi.com'
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram user information:', error);
    return null;
  }
}

async function downloadProfilePic(profilePicUrl) {
  return new Promise((resolve, reject) => {
    const stream = request(profilePicUrl).pipe(fs.createWriteStream('profilePic.jpg'));
    stream.on('finish', () => resolve('profilePic.jpg'));
    stream.on('error', reject);
  });
}

async function downloadImage(url, destination) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(destination, Buffer.from(response.data, 'binary'));
}

async function fetchInstagramPosts(userID) {
  const options = {
    method: 'GET',
    url: `https://instagram-scraper-20231.p.rapidapi.com/userposts/${userID}/12/%7Bend_cursor%7D`,
    headers: {
      'X-RapidAPI-Key': 'ece5655ae3msh55483dd9d60402fp12e36ajsn5adc6b59bc68',
      'X-RapidAPI-Host': 'instagram-scraper-20231.p.rapidapi.com'
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data.edges;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  config: {
    name: "insta",
    aliases: [],
    author: "Kshitiz",
    version: "1.0",
    shortDescription: {
      en: "Get Instagram information or view posts by username or user ID",
    },
    longDescription: {
      en: "Get Instagram information by providing the username or view posts by providing the user ID.",
    },
    category: "INFO",
    guide: {
      en: "{p}insta stalk {username} or {p}insta post {userID}",
    },
  },
  onStart: async function ({ api, event, args }) {
    const subCommand = args[0];
    const identifier = args.slice(1).join(' ');

    if (!subCommand || !identifier) {
      api.sendMessage({ body: 'Invalid command. Please use {p}insta stalk {username} or {p}insta post {userID}' }, event.threadID, event.messageID);
      return;
    }

    if (subCommand.toLowerCase() === 'stalk') {
      try {
       
        const userInfo = await fetchInstagramUserInfo(identifier);

        if (!userInfo) {
          api.sendMessage({ body: `No Instagram information found for the username: ${identifier}.` }, event.threadID);
          return;
        }

       
        const profilePicPath = await downloadProfilePic(userInfo.profile_pic_url_hd || userInfo.profile_pic_url);

       
const message = `✰ *Username:* ${userInfo.username}
✰ *Full Name:* ${userInfo.full_name}
✰ *Biography:* ${userInfo.biography}
✰ *Follower Count:* ${userInfo.edge_followed_by.count}
✰ *Following Count:* ${userInfo.edge_follow.count}
✰ *Category:* ${userInfo.category_name || "Not available"}
✰ *UserID:* ${userInfo.id}
✰ *Is Private:* ${userInfo.is_private ? 'Yes' : 'No'}
✰ *Is Verified:* ${userInfo.is_verified ? 'Yes' : 'No'}
✰ *Mutual Followers Count:* ${userInfo.edge_mutual_followed_by.count}
✰ *Has Guides:* ${userInfo.has_guides ? 'Yes' : 'No'}
✰ *Business Contact Method:* ${userInfo.business_contact_method || "Not available"}
✰ *External URL:* ${userInfo.external_url || "Not available"}

        Type {p}insta post ${userInfo.id} to see this user posts`;


       
        api.sendMessage({ body: message, attachment: fs.createReadStream(profilePicPath) }, event.threadID, event.messageID);
      } catch (error) {
        console.error(error);
        api.sendMessage({ body: 'An error occurred while fetching Instagram information.\nPlease try again later.' }, event.threadID);
      }
    } else if (subCommand.toLowerCase() === 'post') {
      try {
        
        const posts = await fetchInstagramPosts(identifier);

        if (!posts || posts.length === 0) {
          api.sendMessage({ body: `No Instagram posts found for user ID: ${identifier}.` }, event.threadID, event.messageID);
          return;
        }

        const postTitles = posts.map((post, index) => `${index + 1}. ${post.node.shortcode} - ${post.node.edge_media_to_caption.edges[0]?.node.text || 'No Caption'}`);
        const message = `Choose a post by replying with its number:\n\n${postTitles.join('\n')}`;

        const tempFilePath = path.join(os.tmpdir(), 'insta_response.json');
        fs.writeFileSync(tempFilePath, JSON.stringify(posts));

        api.sendMessage({ body: message }, event.threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: 'insta',
            messageID: info.messageID,
            author: event.senderID,
            tempFilePath,
          });
        });
      } catch (error) {
        console.error(error);
        api.sendMessage({ body: 'An error occurred while fetching Instagram posts.\nPlease try again later.' }, event.threadID);
      }
    } else {
      api.sendMessage({ body: 'Invalid subcommand. Please use {p}insta stalk {username} or {p}insta post {userID}' }, event.threadID);
    }
  },
  onReply: async function ({ api, event, Reply, args }) {
    const { author, commandName, tempFilePath } = Reply;

    if (event.senderID !== author || !tempFilePath) {
      return;
    }

    const postIndex = parseInt(args[0], 10);

    if (isNaN(postIndex) || postIndex <= 0) {
      api.sendMessage({ body: 'Invalid input.\nPlease provide a valid number.' }, event.threadID, event.messageID);
      return;
    }

    try {
      const posts = JSON.parse(fs.readFileSync(tempFilePath, 'utf-8'));

      if (!posts || posts.length === 0 || postIndex > posts.length) {
        api.sendMessage({ body: 'Invalid post number.\nPlease choose a number within the range.' }, event.threadID, event.messageID);
        return;
      }

      const selectedPost = posts[postIndex - 1];
      const postUrl = selectedPost.node.display_url;

      if (!postUrl) {
        api.sendMessage({ body: 'Error: Post not found.' }, event.threadID, event.messageID);
        return;
      }

      const tempImagePath = path.join(os.tmpdir(), 'insta_image.jpg');
      await downloadImage(postUrl, tempImagePath);

      
      await api.sendMessage({
        body: `Here is the Instagram post:\n${selectedPost.node.edge_media_to_caption.edges[0]?.node.text || 'No Caption'}`,
        attachment: fs.createReadStream(tempImagePath),
      }, event.threadID, event.messageID);

     
      fs.unlinkSync(tempImagePath);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: 'An error occurred while processing the post.\nPlease try again later.' }, event.threadID, event.messageID);
    } finally {
      fs.unlinkSync(tempFilePath);
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};
