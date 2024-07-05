module.exports = {
  config: {
    name: "war",
    version: "1.0",
    author: "hedroxyy",
    role: 2,
    category: "texts",
    guide: {
      vi: "Not Available",
      en: "Use .war on to activate War Mode, .war off to deactivate, and .war @mention to send a message in War Mode."
    }
  },

  onStart: async function ({ api, event, args }) {
    // Initialize userData if it doesn't exist
    if (typeof global.userData === 'undefined') {
      global.userData = {};
    }
    if (typeof global.userData[event.threadID] === 'undefined') {
      global.userData[event.threadID] = {};
    }
    if (typeof global.userData[event.threadID].warMode === 'undefined') {
      global.userData[event.threadID].warMode = false;
    }
    if (typeof global.userData[event.threadID].warInterval === 'undefined') {
      global.userData[event.threadID].warInterval = null;
    }

    const userData = global.userData[event.threadID];

    if (args[0] === "on") {
      userData.warMode = true;
      return api.sendMessage("War Mode activated.", event.threadID);
    } else if (args[0] === "off") {
      userData.warMode = false;
      if (userData.warInterval) {
        clearInterval(userData.warInterval);
        userData.warInterval = null;
      }
      return api.sendMessage("War Mode deactivated.", event.threadID);
    } else if (userData.warMode && Object.keys(event.mentions).length > 0) {
      var mention = Object.keys(event.mentions)[0];
      let name = event.mentions[mention];
      var arraytag = [{ id: mention, tag: name }];
      var a = function (a) { api.sendMessage(a, event.threadID); }

      if (userData.warInterval) {
        clearInterval(userData.warInterval);
      }

      userData.warInterval = setInterval(() => {
        a({ body: "TERII AMA KO KALO PUTII MA LYAMMMA LYAMMA CHKAMM MUJII THUKK LAII LAII MADRCHOOOD BESYYA AMA KO XORO " + name, mentions: arraytag });
        setTimeout(() => {
          a({ body: "TEORO AMAA LAAII KOPCHI MAA LAGERW CHIKAAMM RANNDDII MAKAA BAXHHA😭💋 " + name, mentions: arraytag });
        }, 500); // Reduced delay between messages to 500 milliseconds
      }, 1000); // Reduced interval duration to 1000 milliseconds
    } else if (!userData.warMode) {
      return api.sendMessage("War Mode is currently deactivated.", event.threadID);
    } else {
      return api.sendMessage("You need to mention someone to send a message.", event.threadID);
    }
  }
};
