const request = require('request');
const fs = require('fs');

module.exports = {
  config: {
    name: "qr",
    version: "1.0",
    shortDescription: "Generate a QR code to share links/text easily",
    longDescription: "Generate a QR code to share links/text easily. Any text after the qr command will be encoded in the QR code. For multi-coloured QR codes, use the qr+ command instead.",
    category: "search",
    guide: "-qr {text}",
    envConfig: {}
  },
  onStart: async function({ message, event, threadsData, args }) {
    if (args.length < 1) { 
      return message.reply("You must add text to your command, so I can convert it to a QR code.\Eg: `-qr This message is now encoded as a QR code`");
    } else {
      // Necessary for choosing random colours for rich embeds
      var colour_array = ["1211996", "3447003", "13089792", "16711858", "1088163", "16098851", "6150962"]
      var randomNumber = getRandomNumber(0, colour_array.length - 1);
      var randomColour = colour_array[randomNumber];
      var user_text = args.join(" ").split(" ").join("%20")
      var qr_generator = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user_text}`;
      
      // Use request to fetch the QR code image from the API endpoint
      request(qr_generator, { encoding: 'binary' }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          // Save the image as a file on the server
          fs.writeFile('qr.png', body, 'binary', function(err) {
            if (err) {
              console.error(err);
              return message.reply("An error occurred while generating the QR code.");
            }
            // Send the saved image file using sendLocalImage function
            message.reply({
              attachment: fs.createReadStream('qr.png')
            }, (err) => {
              if (err) {
                console.error(err);
                return message.reply("An error occurred while sending the QR code image.");
              }
              // Remove the saved image file
              fs.unlink('qr.png', function(err) {
                if (err) console.error(err);
              });
            });
          });
        } else {
          return message.reply("An error occurred while generating the QR code.");
        }
      });
    }

    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  },
  onEvent: async function({ api, event, threadsData }) {}
};