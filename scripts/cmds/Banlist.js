module.exports.config = {
  name: "bannedlist",
  version: "1.0.1",
aliases: ["banned"],
  author: {
      name: "NTKhang",
      contacts: ""
  },
  cooldowns: 5,
  role: 1,
  shortDescription: "see list of banned groups/users",
  longDescription: "see list of banned groups/users",
  category: "owner",
  guide: "{p}{n} [thread|user]"
};

module.exports.onStart = async function({ api, event, args, usersData, threadsData }) {
  let target, type;
  if (["thread", "-t"].includes(args[0])) {
      target = await threadsData.getAll();
      type = "group";
  } else if (["user", "-u"].includes(args[0])) {
      target = await usersData.getAll();
      type = "user";
  } else return api.sendMessage("Syntax error! Please use {p}bannedlist [thread|user]", event.threadID);

  const bannedList = target.filter(item => item.banned.status);
  const msg = bannedList.reduce((i, item) => i += `Name: ${item.name}\nID: ${item.id}\nReason: ${item.banned.reason}\nTime: ${item.banned.date}\n\n`, "");

  api.sendMessage(msg ? `Currently ${bannedList.length} \n${type}(s) have been banned from using the bot:\n${msg}` : `There are no \n${type}(s) who are prohibited from using the bot.`, event.threadID);
}
