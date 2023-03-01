const axios = require("axios");
const fs = require("fs-extra");
const execSync = require("child_process").execSync;

module.exports = {
  config: {
    name: "update",
    version: "1.0",
    author: "Chat GPT",
    role: 2,
    shortDescription: {
      en: "Check for and install updates for the chatbot.",
      vi: "Kiểm tra và cài đặt bản cập nhật cho chatbot."
    },
    longDescription: {
      en: "Checks for a new version of the chatbot on GitHub.",
      vi: "Kiểm tra phiên bản mới nhất của chatbot trên GitHub."
    },
    category: "owner",
    guide: {
      en: "{pn}",
      vi: "{pn}"
    }
  },

  langs: {
    vi: {
      noUpdates: "Bạn đang sử dụng phiên bản mới nhất của GoatBot V2.",
      updatePrompt: "Bạn đang sử dụng phiên bản %1. Hiện tại đã có phiên bản %2. Bạn có muốn cập nhật chatbot lên phiên bản mới nhất không? Thả cảm xúc bất kỳ vào tin nhắn này để xác nhận.",
      updateConfirmed: "Đã xác nhận, đang cập nhật...",
      updateComplete: "Cập nhật thành công! Chatbot sẽ khởi động lại để áp dụng thay đổi."
    },
    en: {
      noUpdates: "You are using the latest version of GoatBot V2.",
      updatePrompt: "You are using version %1. A new version %2 is available. Do you want to update the chatbot to the latest version? React to this message to confirm.",
      updateConfirmed: "Confirmed, updating...",
      updateComplete: "Update complete! The chatbot will restart to apply the changes."
    }
  },

  onLoad: async function ({ api }) {
    if (fs.existsSync(__dirname + "/tmp/rebootUpdated.txt")) {
      const threadID = fs.readFileSync(__dirname + "/tmp/rebootUpdated.txt", "utf-8");
      fs.removeSync(__dirname + "/tmp/rebootUpdated.txt");
      api.sendMessage("The chatbot has been restarted.", threadID);
    }
  },

  onStart: async function ({ message, getLang, commandName, event }) {
    // Check for updates
    const { data: { version } } = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/package.json");
    const currentVersion = require("../../package.json").version;
    if (compareVersion(version, currentVersion) < 1)
      return message.reply(getLang("noUpdates"));

    // Prompt user to update
    message.reply(getLang("updatePrompt", currentVersion, version), (err, info) => {
      if (err)
        return console.error(err);

      global.GoatBot.onReaction.set(info.messageID, {
        messageID: info.messageID,
        threadID: info.threadID,
        authorID: event.senderID,
        commandName
      });
    });
  },

  onReaction: async function ({ message, getLang, Reaction, event }) {
    const { userID } = event;
    if (userID != Reaction.authorID)
      return;
    await message.reply(getLang("updateConfirmed"));
    // Update chatbot
    execSync("node update", {
      stdio: "inherit"
    });
    fs.writeFileSync(__dirname + "/tmp/rebootUpdated.txt", event.threadID);
    await message.reply(getLang("updateComplete"));
    process.exit(2);
  }
};

function compareVersion(version1, version2) {
  const v1 = version1.split(".");
  const v2 = version2.split(".");
  for (let i = 0; i < 3; i++) {
    if (parseInt(v1[i]) > parseInt(v2[i]))
      return 1;
    if (parseInt(v1[i]) < parseInt(v2[i]))
      return -1;
  }
  return 0;
}
