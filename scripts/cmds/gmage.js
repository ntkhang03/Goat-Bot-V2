const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');

module.exports = {
  config: {
    name: 'gmage',
    version: '1.4',
    author: 'Cruizex',
    category: 'Utility',
    shortDescription: 'Search Google Images and send attachments.',
    longDescription: 'Usage: -gmage <search_query>',
  },

  onStart: async function ({ api, event, args }) {
    try {
      const searchQuery = args.join(' ');
      const apiKey = 'AIzaSyDO33bwnu3Jc_HPLpR1GKH-bg8WbNPyJaE';
      const searchEngineID = 'a11473c13288f413e';

      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: apiKey,
          cx: searchEngineID,
          q: searchQuery,
          searchType: 'image',
        },
      });

      const images = response.data.items.slice(0, 3); // Limit to the first 3 images

      const imgData = [];
      let imagesDownloaded = 0;

      for (const image of images) {
        const imageUrl = image.link;

        try {
          const imageResponse = await axios.head(imageUrl); // Attempt to check if the image URL is valid

          // Check if the response headers indicate a valid image
          if (imageResponse.headers['content-type'].startsWith('image/')) {
            const response = await axios({
              method: 'get',
              url: imageUrl,
              responseType: 'stream',
            });

            const outputFileName = path.join(__dirname, 'cache', `downloaded_image_${imgData.length + 1}.png`);
            const writer = fs.createWriteStream(outputFileName);

            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
            });

            imgData.push(fs.createReadStream(outputFileName));
            imagesDownloaded++;
          } else {
            console.error(`Invalid image (${imageUrl}): Content type is not recognized as an image.`);
          }
        } catch (error) {
          console.error(`Error downloading image (${imageUrl}):`, error);
          // Skip the current image if there's an error
          continue;
        }
      }

      if (imagesDownloaded > 0) {
        // Send only non-bad images as attachments
        api.sendMessage({ attachment: imgData }, event.threadID, event.messageID);

        // Remove local copies
        imgData.forEach((img) => fs.remove(img.path));
      } else {
        api.sendMessage('No valid images found.', event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage('An error occurred.', event.threadID, event.messageID);
    }
  },
};
