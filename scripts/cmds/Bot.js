module.exports = {
    config: {
        name: "aminul sordar",
        version: "1.0",
        author: "kivv",
        countDown: 5,
        role: 0,
        shortDescription: "No Prefix",
        longDescription: "No Prefix",
        category: "reply",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "aminul sordar") return message.reply(" উনি এখন কাজে বিজি আছে যা বলার আমাকে বলতে পারেন😘😒😒");
}
};
