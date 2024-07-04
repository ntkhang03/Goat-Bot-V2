let autoseenEnabled = false;

module.exports = {
  config: {
    name: "autoseen",
    version: "1.0",
    author: "hedroxyy",
    countDown: 15,
    role: 0,
    shortDescription: "Toggle autoseen feature on or off",
    longDescription: "Enable or disable the autoseen feature which marks all messages as read automatically.",
    category: "owner",
    guide: {
      en: "{pn} on/off"
    }
  },

  onStart: async function ({ api, message, args }) {
    const subCommand = args[0];

    if (subCommand === "on") {
      autoseenEnabled = true;
      message.reply("✅ | Autoseen feature has been enabled.");
    } else if (subCommand === "off") {
      autoseenEnabled = false;
      message.reply("✅ | Autoseen feature has been disabled.");
    } else {
      message.reply("Usage: {pn} on/off");
    }
  },

  onChat: async function ({ api }) {
    if (autoseenEnabled) {
      api.markAsReadAll();
    }
  }
};
