const axios = require("axios");

module.exports = {
    config: {
        name: "emojiremix",
        aliases: ["remix"],
        version: "1.3",
        author: "Hassan",
        countDown: 5,
        role: 0,
        shortDescription: "Mix 3 emojis",
        longDescription: {
            vi: "Mix 3 emoji lại với nhau",
            en: "Mix 3 emojis together"
        },
        guide: {
            vi: "{pn} <emoji1> <emoji2> <emoji3>"
                + "\Ví dụ: {pn} 😦 🥲 😥",
            en: "{pn} <emoji1> <emoji2> <emoji3>"
                + "\Example: {pn} 😦 🥲 😥"
        },
        category: "fun"
    },

    langs: {
        vi: {
            error: "Rất tiếc, emoji %1, %2, và %3 không thể mix được",
            success: "Emoji %1, %2, và %3 đã được mix thành %4 ảnh"
        },
        en: {
            error: "Sorry, emojis %1, %2, and %3 cannot be mixed",
            success: "Emojis %1, %2, and %3 mixed into %4 images"
        }
    },

    onStart: async function ({ message, args, getLang }) {
        const readStream = [];
        const emojis = args.slice(0, 3);

        if (emojis.length !== 3)
            return message.SyntaxError();

        const generate1 = await generateEmojimix(emojis[0], emojis[1]);
        const generate2 = await generateEmojimix(emojis[1], emojis[2]);
        const generate3 = await generateEmojimix(emojis[0], emojis[2]);

        if (generate1) readStream.push(generate1);
        if (generate2) readStream.push(generate2);
        if (generate3) readStream.push(generate3);

        if (readStream.length === 0)
            return message.reply(getLang("error", ...emojis));

        message.reply({
            body: getLang("success", ...emojis, readStream.length),
            attachment: readStream
        });
    }
};

async function generateEmojimix(emoji1, emoji2) {
    try {
        const { data: response } = await axios.get("https://goatbotserver.onrender.com/taoanhdep/emojimix", {
            params: { emoji1, emoji2 },
            responseType: "stream"
        });
        response.path = `emojimix${Date.now()}.png`;
        return response;
    } catch (e) {
        return null;
    }
}
