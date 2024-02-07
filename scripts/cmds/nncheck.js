async function checkShortCut(nickname, uid, usersData) {
    try {
        /\{userName\}/gi.test(nickname) ? nickname = nickname.replace(/\{userName\}/gi, await usersData.getName(uid)) : null;
        /\{userID\}/gi.test(nickname) ? nickname = nickname.replace(/\{userID\}/gi, uid) : null;
        return nickname;
    } catch (e) {
        return nickname;
    }
}

module.exports = {
    config: {
        name: "nn",
        version: "1.0",
        author: "KSHITIZ",
        countDown: 5,
        role: 0,
        shortDescription: "Check and reply with nickname",
        longDescription: "Check and reply with the nickname of a mentioned user or your own nickname",
        category: "𝗕𝗢𝗫",
        guide: {
            body: "{pn} @user: Check and reply with the nickname of the mentioned user",
            attachment: {},
        },
    },

    langs: {
        error: "An error has occurred, please try again later",
    },

    onStart: async function ({ args, message, event, api, usersData, getLang }) {
        const mentions = Object.keys(event.mentions);
        const uid = event.senderID;
        const threadID = event.threadID;

        if (mentions.length === 0) {

            const threadInfo = await api.getThreadInfo(threadID);


            const participant = threadInfo.participantIDs.find(id => id === uid);

            if (participant) {
                const yourNickname = threadInfo.nicknames[participant];
                const nickname = yourNickname || "Default please change your nickname";


                message.reply(`Your Nickname: ${nickname}`);
            } else {
                message.reply("Your nickname is not set in this group.");
            }
        } else {

            const mentionedUid = mentions[0];
            const threadInfo = await api.getThreadInfo(threadID);


            const participant = threadInfo.participantIDs.find(id => id === mentionedUid);

            if (participant) {
                const mentionedNickname = threadInfo.nicknames[participant];
                const nickname = await checkShortCut(mentionedNickname, mentionedUid, usersData);


                message.reply(`Nickname of ${event.mentions[mentionedUid]}: ${nickname}`);
            } else {
                message.reply(`The mentioned user (${event.mentions[mentionedUid]}) is not a participant in this group.`);
            }
        }
    },
};
