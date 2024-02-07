const axios = require("axios");//based on Nepal education

module.exports = {
  config: {
    name: "gpa",
    aliases: ["gpacalc"],
    version: "1.0",
    author: "kshitiz",
    countDown: 5,
    role: 0,
    shortDescription: "gpa calculate",
    longDescription: {
      en: "Convert GPA to percentage and provide letter equivalent.",
    },
    category: "info",
    guide: {
      en: "{prefix}gpa your gpa",
    },
  },

  onStart: async function ({ api, event, args }) {
    const userGPA = parseFloat(args[0]);

    if (isNaN(userGPA) || userGPA < 0 || userGPA > 4) {
      api.sendMessage("Please provide a valid GPA between 0 and 4.", event.threadID);
      return;
    }


    const percentage = userGPA * 25;


    let letterEquivalent;
    if (userGPA >= 0 && userGPA < 0.8) {
      letterEquivalent = "E";
    } else if (userGPA >= 0.8 && userGPA < 1.2) {
      letterEquivalent = "D";
    } else if (userGPA >= 1.2 && userGPA < 1.6) {
      letterEquivalent = "D+";
    } else if (userGPA >= 1.6 && userGPA < 2.0) {
      letterEquivalent = "C";
    } else if (userGPA >= 2.0 && userGPA < 2.4) {
      letterEquivalent = "C+";
    } else if (userGPA >= 2.4 && userGPA < 2.8) {
      letterEquivalent = "B";
    } else if (userGPA >= 2.8 && userGPA < 3.2) {
      letterEquivalent = "B+";
    } else if (userGPA >= 3.2 && userGPA < 3.6) {
      letterEquivalent = "A";
    } else {
      letterEquivalent = "A+";
    }

    api.sendMessage(
      `𝐏𝐫𝐨𝐯𝐢𝐝𝐞𝐝 𝐆𝐏𝐀: ${userGPA}\n𝐏𝐫𝐨𝐛𝐚𝐛𝐥𝐞 𝐏𝐞𝐫𝐜𝐞𝐧𝐭𝐚𝐠𝐞: ${percentage}%\n𝐋𝐞𝐭𝐭𝐞𝐫 𝐄𝐪𝐮𝐢𝐯𝐚𝐥𝐞𝐧𝐭: ${letterEquivalent}`,
      event.threadID,
      event.messageID
    );
  },
};
