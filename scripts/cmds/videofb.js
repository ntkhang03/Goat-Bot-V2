const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

module.exports = {
	config: {
		name: "videofb",
		version: "1.2",
		author: "NTKhang",
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
			en: "   {pn} <url video/story>: tải video từ facebook"
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
			error: "An error occurred while downloading the video",
			downloading: "Downloading video for you",
			tooLarge: "Sorry, we can't download the video for you because the size is larger than 83MB"
		}
	},

	onStart: async function ({ args, message, getLang }) {
		if (!args[0])
			return message.reply(getLang("missingUrl"));
		const response = await fbDownloader(args[0]);
		if (response.success === false)
			return message.reply(getLang("error"));

		let success = false;
		const msgSend = message.reply(getLang("downloading"));

		for (const item of response.download) {
			const res = await axios({
				url: item.url,
				responseType: 'stream'
			});
			if (res.headers['content-length'] > 87031808)
				continue;
			res.data.path = global.utils.randomString(10) + '.mp4';
			message.reply({
				attachment: res.data
			}, async () => message.unsend((await msgSend).messageID));
			success = true;
			break;
		}

		if (!success) {
			message.unsend((await msgSend).messageID);
			return message.reply(getLang("tooLarge"));
		}
	}
};


function convertTime(hms) {
	if (hms.length < 3) {
		return hms;
	}
	else if (hms.length < 6) {
		const a = hms.split(':');
		return hms = (+a[0]) * 60 + (+a[1]);
	}
	else {
		const a = hms.split(':');
		return hms = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
	}
}

async function fbDownloader(url) {
	try {
		const response1 = await axios.get("https://fdownloader.net");
		const k_exp = response1.data.split('k_exp="')[1].split('"')[0];
		const k_token = response1.data.split('k_token="')[1].split('"')[0];
		const response = await axios({
			method: 'POST',
			url: 'https://fdownloader.net/api/ajaxSearch',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: qs.stringify({
				'q': url,
				k_exp,
				k_token
			})
		});

		const $ = cheerio.load(response.data.data);
		const download = [];
		$("#fbdownloader > div.tab-wrap > div:nth-child(5) > table > tbody > tr").each(function (i, elem) {
			const trElement = $(elem);
			const tds = trElement.children();
			const quality = $(tds[0]).text().trim();
			const url = $(tds[2]).children("a").attr("href");
			if (url != undefined) {
				download.push({
					quality,
					url
				});
			}
		});

		return {
			success: true,
			video_length: convertTime($("div.clearfix > p").text().trim()),
			download
		};
	}
	catch (err) {
		return {
			success: false
		};
	}
}
