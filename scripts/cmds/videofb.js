const axios = require("axios");
module.exports = {
	config: {
		name: "videofb",
		aliases: ["fbdown", "facebook"],
		version: "1.4",
		author: "Mohammad Alamin",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Tải video từ facebook",
			en: "Download video from facebook"
		},
		longDescription: {
			vi: "Tải video/story từ facebook (công khai)",
			en: "Download video/story from facebook (public)"
		},
		category: "media",
		guide: {
			vi: "   {pn} <url video/story>: tải video từ facebook",
			en: "   {pn} <url video/story>: download video from facebook"
		}
	},

	langs: {
		vi: {
			missingUrl: "Vui lòng nhập url video/story facebook (công khai) bạn muốn tải về",
			error: "Đã xảy ra lỗi khi tải video",
			downloading: "Đang tiến hành tải video cho bạn",
			tooLarge: "Rất tiếc không thể tải video cho bạn vì dung lượng lớn hơn 83MB"
		},
		en: {
			missingUrl: "Please enter the facebook video/story (public) url you want to download",
			missingKey: "Please add your global key on configCommands.json",
			error: "An error occurred while downloading the video",
			downloading: "Downloading video for you",
			tooLarge: "Sorry, we can't download the video for you."
		}
	},

	onStart: async function ({ args, message, getLang, envGlobal }) {
	  if (!args[0]) return message.reply(getLang("missingUrl"));
		let msgSend = null;
		try {
		  msgSend = message.reply(getLang("downloading"));
		  const response = await axios.get('https://anbusec.xyz/api/downloader/facebook',
		  {
		    params: {
		      'apikey': 'lCLCntSNYhy1w1rLiGLJ',
		      'url': args[0]
		    }
		  });
			if (response.data.success === false) {
				return message.reply(getLang("error"));
			}
			const stream = await global.utils.getStreamFromURL(response.data.url);
			await message.reply({
			  body: response.data.title,
			  attachment: stream
			});
			message.unsend((await msgSend).messageID);
		} catch (e) {
		  console.log(e)
			message.unsend((await msgSend).messageID);
			return message.reply(getLang("tooLarge"));
		}
	}
};
