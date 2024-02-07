module.exports = {
    config: {
        name: "out",
        aliases: ["out"],
        version: "1.0",
        author: "Mahir Tahsan",
        countDown: 5,
        role: 2,
        shortDescription: {
            vi: "",
            en: "Leave Chat"
        },
        longDescription: {
            vi: "",
            en: "  Leave chat"
        },
        category: "𝗢𝗪𝗡𝗘𝗥",
        guide: {
            vi: "",
            en: "{pn} for leave this gc: Example: {pn}\} all for leave all gc. Example: {pn} all"
        }
    },
    onStart: async function ({ api, args, message, event }) {
        if (args[0] === "all") {
            const threadList = await api.getThreadList(100, null, ["INBOX"]);
            const botUserID = api.getCurrentUserID();
            threadList.forEach(threadInfo => {
                if (threadInfo.isGroup && threadInfo.threadID !== event.threadID) {
                    api.removeUserFromGroup(botUserID, threadInfo.threadID);
                }
            });
        } else if (!args[0]) {
            api.sendMessage("Bot is leaving the chat.", event.threadID);
            api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
        }
    }
};
