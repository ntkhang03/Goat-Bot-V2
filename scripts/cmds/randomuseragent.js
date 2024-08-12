.cmd install randomuseragent.js const { Random } = require('random-js');

module.exports = {
    config: {
        name: "randomuseragent",
        aliases: ["rua"],
        version: "1.1",
        author: "hedroxyy",
        countDown: 1,
        role: 0,
        shortDescription: "Generate and send random user agents",
        longDescription: "Generate a specified number of random user agents and send them one by one.",
        category: "tools",
        guide: "{pn} {number of user agents}"
    },

    onStart: async function ({ event, message, args }) {
        const numberOfUserAgents = parseInt(args[0]) || 5; // Default to 5 if no number is provided
        const userAgents = generateRandomUserAgents(numberOfUserAgents);

        // Send each user agent one by one
        for (let i = 0; i < userAgents.length; i++) {
            const userAgent = userAgents[i];
            await message.send(`${userAgent}`);
        }
    }
};

function generateRandomUserAgents(numberOfUserAgents) {
    const random = new Random();
    const userAgents = [];

    for (let i = 0; i < numberOfUserAgents; i++) {
        const a = "Mozilla/5.0 (Symbian/3; Series60/";
        const b = random.integer(1, 9);
        const c = random.integer(1, 9);
        const d = "SamsungBrowser";
        const e = random.integer(100, 9999);
        const f = "NEO-AL00 Build/HUAWEINEO-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/";
        const g = random.integer(1, 9);
        const h = random.integer(1, 4);
        const i1 = random.integer(1, 4);
        const j = random.integer(1, 4);
        const k = "Mobile Safari/537.36";

        const userAgent = `${a}${b}.${c} ${d}${e}${f}${g}.${h}.${i1}.${j} ${k}`;
        userAgents.push(userAgent);
    }

    return userAgents;
}
