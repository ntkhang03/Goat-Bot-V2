const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "nsfw",
    version: "1.0",
    author: "Samuel",
    countDown: 5,
    category:"NSFW",
    role: 2
  },

  onStart: async function({ api, args, message, event }) {
    const threadID = event.threadID;
    const approvedIDsPath = path.join(__dirname, "assist_json", "approved_ids.json");
    const pendingIDsPath = path.join(__dirname, "assist_json", "pending_ids.json");

    if (args[0] === "approved" && args[1]) {
      const id = args[1];
      const messageFromAdmin = args.slice(2).join(" ");

      let approvedIDs = JSON.parse(fs.readFileSync(approvedIDsPath));
      if (approvedIDs.includes(id)) {
        message.reply("This thread ID is already approved");
      } else {
        approvedIDs.push(id);
        fs.writeFileSync(approvedIDsPath, JSON.stringify(approvedIDs));
        api.sendMessage(`📌 Request Accepted📌\nyour request has been approved by BotAdmin\nNow all NSFW commands will work for this thread.\n\nMessage from admin: ${messageFromAdmin}`, id);
        message.reply("This Thread has been approved now to use NSFW command\n\n If you don't know how to use this bot then join the Loid Bot Official for support  \nType : $support \nto join.");

        // Remove from pending IDs list
        let pendingIDs = JSON.parse(fs.readFileSync(pendingIDsPath));
        if (pendingIDs.includes(id)) {
          pendingIDs.splice(pendingIDs.indexOf(id), 1);
          fs.writeFileSync(pendingIDsPath, JSON.stringify(pendingIDs));
        }
      }
    } else if (args[0] === "remove" && args[1]) {
      const id = args[1];
      const reason = args.slice(2).join(" ");

      let approvedIDs = JSON.parse(fs.readFileSync(approvedIDsPath));
      if (!approvedIDs.includes(id)) {
        message.reply("this thread id is not approved, so no need to remove ");
      } else {
        approvedIDs.splice(approvedIDs.indexOf(id), 1);
        fs.writeFileSync(approvedIDsPath, JSON.stringify(approvedIDs));
        api.sendMessage(`⚠️Warning ⚠️\nNow this Thread ID's permission has been disapproved or removed to use NSFW commands by BotAdmin.\n\nReason: ${reason}\nContact Loid Butter for more \nFB: https://www.facebook.com/profile.php?id=100071880593545`, id);
        message.reply("The thread ID has been removed from using NSFW commend");
      }



                      } else if (args[0] === "disapproved" && args[1] && args[2]) {
      const id = args[1];
      const reason = args.slice(2).join(" ");

      let pendingIDs = JSON.parse(fs.readFileSync(pendingIDsPath));
      if (!pendingIDs.includes(id)) {
        message.reply("This thread ID is not pending approval.");
      } else {
        // Remove from pending IDs list
        pendingIDs.splice(pendingIDs.indexOf(id), 1);
        fs.writeFileSync(pendingIDsPath, JSON.stringify(pendingIDs));
        api.sendMessage(`⚠️ Warning ⚠️\nYour thread ID's permission to use NSFW commands has been disapproved by BotAdmin.\n\nReason: ${reason}\nContact Loid Butter for more information.\nFB: https://www.facebook.com/profile.php?id=100071880593545\n\njoin the loid support Box for fast reply\nType : $support \nto join.`, id);
        message.reply("The thread ID has been disapproved for using NSFW commands.");
          }
      




      
    } else if (args[0] === "check") {
      let approvedIDs = JSON.parse(fs.readFileSync(approvedIDsPath));
      if (approvedIDs.includes(threadID)) {
        message.reply("NSFW is currently on for this thread.");
      } else {
        message.reply("NSFW is currently off for this thread.");
      }
    } else {
      message.reply(`Invalid command usage. Use "$help nsfw" to see how to use this command.`);
    }
  },
};
