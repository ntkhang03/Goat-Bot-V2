const axios = require("axios");
const fs = require("fs-extra");

const apiKey = "Qfmz1xcUvaehs1SaYFLzsBzp";

module.exports = {
    config: {
        name: "rembg",
        version: "2.0",
        aliases: ["rbg"],
        author: "Strawhat Luffy",//fixed by kshitiz 
        countDown: 20,
        role: 2,
        category: "𝗠𝗘𝗗𝗜𝗔",
        shortDescription: "Remove Background from Image",
        longDescription: "Remove Background from any image. Reply to an image or add an image URL to use the command.",
        guide: {
            en: "{pn} reply an image URL | add URL",
        },
    },

    onStart: async function ({ api, args, message, event }) {
        const { getPrefix } = global.utils;

        let imageUrl;
        let type;
        if (event.type === "message_reply") {
            if (["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
                imageUrl = event.messageReply.attachments[0].url;
                type = isNaN(args[0]) ? 1 : Number(args[0]);
            }
        } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
            imageUrl = args[0];
            type = isNaN(args[1]) ? 1 : Number(args[1]);
        } else {
            return message.reply("Please provide an image URL or reply to an image..!⚠️");
        }

        const processingMessage = await message.reply("Removing Background⌛. Please wait...⏰");

        try {
            const response = await axios.post(
                "https://api.remove.bg/v1.0/removebg",
                {
                    image_url: imageUrl,
                    size: "auto",
                },
                {
                    headers: {
                        "X-Api-Key": apiKey,
                        "Content-Type": "application/json",
                    },
                    responseType: "arraybuffer",
                }
            );

            const outputBuffer = Buffer.from(response.data, "binary");

            const fileName = `${Date.now()}.png`;
            const filePath = `./${fileName}`;

            fs.writeFileSync(filePath, outputBuffer);
            message.reply(
                {
                    attachment: fs.createReadStream(filePath),
                },
                () => fs.unlinkSync(filePath)
            );

        } catch (error) {
            message.reply("Something went wrong. Please try again later..!⚠️🤦\\I already sent a message to Admin about the error. He will fix it as soon as possible.🙎");
            const errorMessage = "----RemoveBG Log----\nSomething is causing an error with the removebg command.\nPlease check if the API key has expired.\nCheck the API key here: https://www.remove.bg/dashboard";
            const { config } = global.GoatBot;
            for (const adminID of config.adminBot) {
                api.sendMessage(errorMessage, adminID);
            }
        }

        message.unsend(processingMessage.messageID);
    },
};