const axios = require("axios");

module.exports = {
config: {
name: "insult",
aliases: [],
version: "1.0",
author: "kshitiz",
countDown: 5,
role: 0,
shortDescription: "",
longDescription: "Insult someone by using this cmd",
category: "",
guide: "{pn} @mention",
},

onStart: async function ({ api, event, args }) {
try {
const mention = Object.keys(event.mentions);

if (mention.length !== 1) {
api.sendMessage("Please mention one person to insult.", event.threadID);
return;
}

const mentionName = event.mentions[mention[0]].replace("@", ""); 

if (mentionName.toLowerCase().includes("Strãwhat")) {//re1place Strawhat with your name
api.sendMessage("Ayo Gay You can't insult my owner🤬 ", event.threadID);
return;
}

const url = "https://evilinsult.com/generate_insult.php?lang=en&type=json";

const response = await axios.get(url);
const insult = response.data.insult;

const insultMessage = `${mentionName}, ${insult}`;
api.sendMessage(insultMessage, event.threadID);

} catch (error) {
console.error(error);
api.sendMessage("Error!", event.threadID);
}
},
};
