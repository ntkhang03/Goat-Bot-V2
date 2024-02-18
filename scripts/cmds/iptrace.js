const axios = require("axios");
const adminName = "Void"; // Replace with your admin's name
const adminUID = "100071880593545"; // Replace with your admin's UID
const adminLink = "https://www.facebook.com/100071880593545"; // Replace with your admin's profile link

module.exports = {
config: {
  name: "trace",
  author:"Ber/zed",// Convert By Goatbot Zed
   role: 2,
  shortDescription: "Check User Location ",
  longDescription: "",
  category: "Info 📜",
  guide: "{pn} trace"
},


 onStart: async function ({api, event, args }) {
  const axios = require("axios");

  // Check if an IP address is provided
  if (!args[0]) {
    return api.sendMessage("Please enter an IP address to check.", event.threadID, event.messageID);
  }

  const ipAddress = args[0];

  try {
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}?fields=66846719`);
    const infoip = response.data;

    if (infoip.status === "fail") {
      return api.sendMessage(`Error! An error occurred. Please try again later: ${infoip.message}`, event.threadID, event.messageID);
    }

    // Get the user's information (await the promise)
    const userInfo = await api.getUserInfo(event.senderID);
    const userObj = userInfo[event.senderID];

    const userName = userObj ? userObj.name || "Name not available" : "Name not available";
    const userUID = event.senderID;
    const userGender = userObj ? (userObj.gender === 1 ? "Male" : userObj.gender === 2 ? "Female" : "Gender not available") : "Gender not available";
    const userBirthday = userObj ? userObj.birthday || "Birthday not available" : "Birthday not available";

    // Determine user status (online, offline, idle)
    const userStatus = userObj ? (userObj.isOnline ? "Online 🟢" : "Offline 🔴") : "Status not available";

    // Check friendship status (friends or not)
    const areFriends = userObj ? (userObj.isFriend ? "Yes ✅" : "No ❌") : "Friendship status not available";

    // Construct Facebook profile link
    const fbLink = `https://www.facebook.com/profile.php?id=${userUID}`;

    const geolocationInfo = `
🌍 Location: ${infoip.city}, ${infoip.regionName}, ${infoip.country}
🌐 Continent: ${infoip.continent}
🏁 Country Code: ${infoip.countryCode}
🌆 Region/State: ${infoip.regionName}
🏙️ City: ${infoip.city}
🌏 District: ${infoip.district}
📮 ZIP code: ${infoip.zip}
🌐 Latitude: ${infoip.lat}
🌐 Longitude: ${infoip.lon}
⏰ Timezone: ${infoip.timezone}
🏢 Organization: ${infoip.org}
💰 Currency: ${infoip.currency}

User Information:
👤 User Name: ${userName}
🆔 User UID: ${userUID}
🧍 Gender: ${userGender}
🎂 Birthday: ${userBirthday}
⏳ Status: ${userStatus}
🤝 Friends: ${areFriends}
🌐 Facebook Profile: ${fbLink}

Admin Information:
👤 Admin Name: ${adminName}
🆔 Admin UID: ${adminUID}
🔗 Admin Profile: ${adminLink}

Location Map:
🗺️ [View on Map](https://www.google.com/maps?q=${infoip.lat},${infoip.lon})
`;

    return api.sendMessage(geolocationInfo, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage("An error occurred while processing the request.", event.threadID, event.messageID);
  }
},
  };
