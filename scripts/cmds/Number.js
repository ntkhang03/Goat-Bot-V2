const axios = require("axios");

module.exports = {
  config: {
    name: "number",
    version: "1.0",
    author: "General",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Validate and format phone numbers.",
    },
    longDescription: {
      en: "Get details about a phone number, including its validity, country, and formatting.",
    },
    category: "utility",
    guide: {
      en: "{pn} <ph.number>",
    }
  },

  onStart: async function ({ api, args, event, message }) {
    const apiKey = "s+g0tSf9ktGIDWMijMyFkw==Tao0FeuSN58Lzxy3";
    const apiUrl = 'https://api.api-ninjas.com/v1/validatephone';

    if (args.length < 1) {
      message.reply("Please provide the phone number for validation.");
      return;
    }

    const phoneNumberToValidate = args[0];

    try {
      const response = await axios.get(`${apiUrl}?number=${phoneNumberToValidate}`, { headers: { 'X-Api-Key': apiKey } });

      if (response.status === 200) {
        const numberInfo = response.data;

        const formattedMessage = `
📞 Phone Number Validation: ${numberInfo.format_international}

- Validity: ${numberInfo.is_valid ? "Valid" : "Invalid"}
- Properly Formatted: ${numberInfo.is_formatted_properly ? "Yes" : "No"}
- Country: ${numberInfo.country}
- Location: ${numberInfo.location}
- Timezones: ${numberInfo.timezones.join(", ")}
- National Format: ${numberInfo.format_national}
- International Format: ${numberInfo.format_international}
- E164 Format: ${numberInfo.format_e164}
`;

        message.reply(formattedMessage);
      } else {
        message.reply("Phone number information not found. Please check the number or try again later.");
      }
    } catch (error) {
      console.error("Error fetching phone number information:", error);
      message.reply("Error fetching phone number information. Please try again later.");
    }
  },
};
