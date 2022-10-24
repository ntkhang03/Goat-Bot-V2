const axios = require("axios");
const qs = require("qs");
const cheerio = require("cheerio");
const tinyUrl = require('tinyurl');
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "tik",
		aliases: ["tiktok"],
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Tiktok",
		longDescription: {
			vi: "Tải video/slide (image), audio từ link tiktok",
			en: "Download video/slide (image), audio from tiktok link"
		},
		category: "media",
		guide: {
			vi: "   {pn} [video|-v|v] <url>: dùng để tải video/slide (image) từ link tiktok."
				+ "\n   {pn} [audio|-a|a] <url>: dùng để tải audio từ link tiktok",
			en: "   {pn} [video|-v|v] <url>: use to download video/slide (image) from tiktok link."
				+ "\n   {pn} [audio|-a|a] <url>: use to download audio from tiktok link"
		}
	},

	langs: {
		vi: {
			invalidUrl: "Vui lòng nhập url tiktok hợp lệ",
			downloadingVideo: "Đang tải video: %1...",
			downloadedSlide: "Đã tải slide: %1\n%2",
			downloadedVideo: "Đã tải video: %1\nUrl Download: %2",
			downloadingAudio: "Đang tải audio: %1...",
			downloadedAudio: "Đã tải audio: %1"
		},
		en: {
			invalidUrl: "Please enter a valid tiktok url",
			downloadingVideo: "Downloading video: %1...",
			downloadedSlide: "Downloaded slide: %1\n%2",
			downloadedVideo: "Downloaded video: %1\nDownload Url: %2",
			downloadingAudio: "Downloading audio: %1...",
			downloadedAudio: "Downloaded audio: %1"
		}
	},

	onStart: async function ({ args, message, getLang }) {
		switch (args[0]) {
			case "video":
			case "-v":
			case "v": {
				const data = await query(args[1]);
				if (data.status == 'error') {
					if (data.message == 'It seems that TikTok is changed something on their website, so we are not able to reach their data. Please wait for 5 minutes and try to request your link again. We are looking into this issue.')
						return message.reply(getLang("invalidUrl"));
					else
						return message.reply(data.message);
				}

				const msgSend = message.reply(getLang("downloadingVideo", data.title));
				const linksNoWatermark = data.downloadUrls;
				if (Array.isArray(linksNoWatermark)) {
					const allStreamImage = await Promise.all(linksNoWatermark.map(link => getStreamFromURL(link)));
					const allImageShortUrl = await Promise.all(linksNoWatermark.map((link, index) => tinyUrl
						.shorten(link)
						.then(shortUrl => `${index + 1}: ${shortUrl}`)
					));
					message.reply({
						body: getLang("downloadedSlide", data.title, allImageShortUrl.join('\n')),
						attachment: allStreamImage
					}, async () => message.unsend((await msgSend).messageID));
					return;
				}
				const streamFile = await getStreamFromURL(linksNoWatermark, 'video.mp4');
				message.reply({
					body: getLang("downloadedVideo", data.title, await tinyUrl.shorten(linksNoWatermark)),
					attachment: streamFile
				}, async () => message.unsend((await msgSend).messageID));
				break;
			}
			case "audio":
			case "a":
			case "-a": {
				const dataAudio = await query(args[1], true);
				if (dataAudio.status == 'error') {
					if (dataAudio.message == 'It seems that TikTok is changed something on their website, so we are not able to reach their data. Please wait for 5 minutes and try to request your link again. We are looking into this issue.')
						return message.reply("Vui lòng nhập url tiktok hợp lệ");
					else
						return message.reply(dataAudio.message);
				}
				const urlAudio = dataAudio.downloadUrls, audioName = dataAudio.title;
				const msgSendAudio = message.reply(getLang("downloadingAudio", audioName));
				const streamFileAudio = await getStreamFromURL(urlAudio, "audio.mp3");
				message.reply({
					body: getLang("downloadedAudio", audioName),
					attachment: streamFileAudio
				}, async () => message.unsend((await msgSendAudio).messageID));
				break;
			}
			default: {
				message.SyntaxError();
			}
		}
	}
};

async function query(url, isMp3 = false) {
	const res = await axios.get("https://ssstik.io/en");
	const tt = res.data.split(`"tt:'`)[1].split(`'"`)[0];
	const { data: result } = await axios({
		url: "https://ssstik.io/abc?url=dl",
		method: "POST",
		data: qs.stringify({
			id: url,
			locale: 'en',
			tt
		}),
		"headers": {
			"uset-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33"
		}
	});

	const $ = cheerio.load(result);
	if (result.includes('<div class="is-icon b-box warning">'))
		throw {
			status: "error",
			message: $('p').text()
		};

	const allUrls = $('.result_overlay_buttons > a');

	const format = {
		status: 'success',
		title: $('.maintext').text()
	};

	const slide = $(".slide");
	if (slide.length != 0) {
		const url = [];
		slide.each((index, element) => {
			url.push($(element).attr('href'));
		});
		format.downloadUrls = url;
		return format;
	}
	format.downloadUrls = $(allUrls[isMp3 ? allUrls.length - 1 : 0]).attr('href')
	return format;
}