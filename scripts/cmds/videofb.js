const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

module.exports = {
	config: {
		name: "videofb",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Tải video từ facebook",
		longDescription: "Tải video/story từ facebook (công khai)",
		category: "media",
		guide: "   {pn} {{<url video/story>}}: tải video từ facebook"
	},

	onStart: async function ({ args, message }) {
		if (!args[0])
			return message.reply(`Vui lòng nhập url video/story facebook (công khai) bạn muốn tải về`);
		const response = await fbDownloader(args[0]);
		if (response.success === false)
			return message.reply(`Đã xảy ra lỗi khi tải video`);

		let success = false;
		const msgSend = message.reply(`Đang tiến hành tải video cho bạn`);

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
			return message.reply('Rất tiếc không thể tải video cho bạn vì dung lượng lớn hơn 83MB');
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
		const response = await axios({
			method: 'POST',
			url: 'https://fdownloader.net/api/ajaxSearch',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: qs.stringify({
				'q': url
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
