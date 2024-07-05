const axios = require("axios");
const fs = require('fs-extra');
const path = require('path');
const { shortenURL } = global.utils;

async function shortURL(api, event) {
    if (event.type !== "message_reply" || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return api.sendMessage({ body: "❌ | Please reply to an attachment." }, event.threadID, event.messageID);
    }

    const attachment = event.messageReply.attachments[0];

    try {
        const shortUrl = await shortenURL(attachment.url);
        api.sendMessage({ body: `${shortUrl}` }, event.threadID, event.messageID);
    } catch (error) {
        api.sendMessage({ body: "❌ | Error occurred while shortening URL." }, event.threadID, event.messageID);
        console.error(error);
    }
}

module.exports = {
    config: {
        name: "tinyurl",
        aliases: ["turl"],
        version: "2.0",
        author: "Vex_Kshitiz",
        countDown: 10,
        role: 0,
        shortDescription: "alternative of imgurl",
        longDescription: "alternative of imgurl",
        category: "utility",
        guide: "{p}tinyurl"
    },
    onStart: function ({ api, event }) {
        return shortURL(api, event);
    }
};
