module.exports = {
  config: {
    name: "gcadmin",
    aliases: ['groupadmin', 'admingc', 'admingroup'],
    version: "1.0",
    author: "hedroxyy",
    countDown: 5,
    role: 1,
    shortDescription: "gc admin management",
    longDescription: "gc admin management",
    category: "box",
    guide: {
      en: "{p}{n} add @mention / remove @mention",
    }
  },

  onStart: async function ({ api, event, args }) {
    const command = args[0];
    const target = args.slice(1).join(" ");
    const threadID = event.threadID;

    switch (command) {
      case "add":
        await addAdmin(api, event, threadID, target);
        break;
      case "remove":
        await removeAdmin(api, event, threadID, target);
        break;
      default:
        api.sendMessage("Invalid command! Usage: " + this.config.guide.en, threadID);
    }
  }
};

async function addAdmin(api, event, threadID, target) {
  try {
    const userID = await resolveUserID(api, event, target);
    await api.changeAdminStatus(threadID, userID, true);
    api.sendMessage(`Added ${target} as admin.`, threadID);
  } catch (error) {
    console.error("Error adding admin:", error);
    api.sendMessage("Failed to add user as admin.", threadID);
  }
}

async function removeAdmin(api, event, threadID, target) {
  try {
    const userID = await resolveUserID(api, event, target);
    await api.changeAdminStatus(threadID, userID, false);
    api.sendMessage(`Removed ${target} from admin position.`, threadID);
  } catch (error) {
    console.error("Error removing admin:", error);
    api.sendMessage("Failed to remove user from admin position.", threadID);
  }
}

async function resolveUserID(api, event, target) {
  let userID;
  if (target.startsWith('@')) {
    const { mentions } = event;
    for (const mentionID in mentions) {
      if (mentions[mentionID].replace("@", "") === target.slice(1)) {
        userID = mentionID;
        break;
      }
    }
    if (!userID) {
      throw new Error("User not found!");
    }
  } else {
    userID = target;
  }
  return userID;
}
