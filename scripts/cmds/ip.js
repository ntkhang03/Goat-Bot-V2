const axios = require("axios");
module.exports = {
	config: {
		name: "ip",
		version: "1.0",
		author: "Rishad",
		countDown: 30,
		role: 0,
		shortDescription: "get ip address info",
		longDescription: "",
		category: "group",
		guide: {
			en: "{pn} your ip",
		}
	},

  onStart: async function ({ api, event, args, utils }) {
    if (!args.join("")) {
      api.sendMessage("You must enter IP!!!", event.threadID, event.messageID);
    } else {
      var data = (await axios.get(`http://ip-api.com/json/${args.join(" ")}`)).data;
      if (data.status == "fail") {
        api.sendMessage("This IP address could not be found!", event.threadID);
      } else {
        api.sendMessage(
          {
            body: `=====✅${data.status}✅=====\n🌍Continent: \n🏷Region Name: ${data.regionName}\nCountry:${data.country}\n🗺️Region: ${data.region}\n🏞City: ${data.city}\n🏛Country Code: ${data.countryCode}\n⛽️Zip Code: ${data.zip}\n⏱Timezone: ${data.timezone}\n💵Currency: ${data.currency}\n📉Longitude: ${data.lon}\n📈Latitude: ${data.lat}\n 🔍Organization Name: ${data.org}\n👀Query: ${data.query}\n`,
            location: {
              latitude: data.lat,
              longitude: data.lon,
              current: true,
            },
          },
          event.threadID
        );
      }
    }
  },
};
