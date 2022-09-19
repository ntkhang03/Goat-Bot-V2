const axios = require("axios");
const qs = require("qs");
const cheerio = require("cheerio");
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "tik",
		aliases: ["tiktok"],
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Tiktok",
		longDescription: "Tải video, audio từ link tiktok",
		category: "media",
		guide: "{pn} {{[video|-v|v] <url>}}: dùng để tải video từ link tiktok."
			+ "\n{pn} {{[audio|-a|a] <url>}}: dùng để tải audio từ link tiktok"
	},

	onStart: async function ({ args, message }) {
		switch (args[0]) {
			case "video":
			case "-v":
			case "v": {
				const data = await query(args[1]);
				if (data.status == 'error') {
					if (data.message == 'It seems that TikTok is changed something on their website, so we are not able to reach their data. Please wait for 5 minutes and try to request your link again. We are looking into this issue.')
						return message.reply("Vui lòng nhập url tiktok hợp lệ");
					else
						return message.reply(data.message);
				}

				const msgSend = message.reply(`Đang tải video: {{${data.title}}}...`);
				const linksNoWatermark = data.downloadUrl;
				const streamFile = await getStreamFromURL(linksNoWatermark, 'video.mp4');
				message.reply({
					body: `Đã tải video {{${data.desc}}}`,
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
				const urlAudio = dataAudio.downloadUrl, audioName = dataAudio.title;
				const msgSendAudio = message.reply(`Đang tải audio {{"${audioName}"}}...`);
				const streamFileAudio = await getStreamFromURL(urlAudio, "audio.mp3");
				message.reply({
					body: `Đã tải audio {{"${audioName}"}}`,
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
	const { data: result } = await axios({
		url: "https://ssstik.io/abc?url=dl",
		method: "POST",
		data: qs.stringify({
			id: url
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
		title: $('.maintext').text(),
		downloadUrl: $(allUrls[isMp3 ? allUrls.length - 1 : 0]).attr('href')
	};
	return format;
}