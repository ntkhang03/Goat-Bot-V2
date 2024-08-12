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
        setTimeout(() => {
          a({ body: "TERO AAMA KO SIL TUTNEY GARII CHODNA NA PAROSSS MUJII KHATEYYY GAWAAARR 😂💦" + name, mentions: arraytag });
        }, 1000); // Additional message after 1000 milliseconds
        setTimeout(() => {
          a({ body: "MUJI GAREEEB KO BACCHA SALLA XAKKAAA MUJIII AUKAT LESSSS EKSIKKO AUKAT NA BHAKO BUNU 😂💋 " + name, mentions: arraytag });
        }, 1500); // Additional message after 1500 milliseconds
        setTimeout(() => {
          a({ body: "TA MUJII KTA SAMAJ MAH KASARI AAYIS TEI SOCHI RAXUHH MUJII PUTI BHAKO MANXEYY YAAA PUTI FLEX HANNA NA AAIJO 😂💋 " + name, mentions: arraytag });
        }, 2000); // Additional message after 2000 milliseconds
        setTimeout(() => {
          a({ body: "SALA GAWARR TERO JASTO TW MERO BHUTRA SAMAN HOOO JHAT HARU MUJI 2 3 CLASS MAH DNEY FUCCHA FUCHHI BAU SANGA NEU KHOJXA 😂😂💋 " + name, mentions: arraytag });
        }, 2500); // Additional message after 2500 milliseconds
        setTimeout(() => {
          a({ body: "GAWARR KHATEYYY KOO XOROO MUJII TAILET LADOO CHUSNA BAHEK K GAREKO XASS HMM MUJII ? 😂😂💋 KHATEYY SALLA JAAA GAYERW BLOUSE LAGAYERW GHUMMM 😂👌 " + name, mentions: arraytag });
        }, 3000); // Additional message after 3000 milliseconds
        setTimeout(() => {
          a({ body: "MUJI THAMEL KO MAAAL SALA GAWARRR KO NASOOOOO AUKAT LESSS TERO CHAK MAH MERO LADO KO JHATYARO HANNU PARNEY BELA BHAYO 😂👌 " + name, mentions: arraytag });
        }, 3500); // Additional message after 3500 milliseconds
        setTimeout(() => {
          a({ body: "HEER BABU TW MUJI KO AUKAT XAINA BUJHIS AHILEY TESAILEY BHANDAI XUH MUJI AAFNO PUTI FLX NA HAAAN CHIKNA TIME LAGAUDANA 😂👌" + name, mentions: arraytag });
        }, 4000); // Additional message after 4000 milliseconds
        setTimeout(() => {
          a({ body: "SALA RATNA PARK KOO MAAAL MUJI TERO RATE KATI HO BHANTWWW ? MUJII PUTI FLEX HANDAI HIDXAS RANDI KAAA BAAAN 😂😂👌 " + name, mentions: arraytag });
        }, 4500); // Additional message after 4500 milliseconds
      }, 5000); // Adjusted interval duration to 5000 milliseconds to accommodate all messages
    } else if (!userData.warMode) {
      return api.sendMessage("War Mode is currently deactivated.", event.threadID);
    } else {
      return api.sendMessage("You need to mention someone to send a message.", event.threadID);
    }
  }
};
