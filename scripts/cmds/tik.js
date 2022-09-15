const axios = require("axios");
const qs = require("qs");
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "tik",
		aliases: ["tiktok"],
		version: "1.0",
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
				if (data.message)
					return message.reply(data.message);
				if (!data.links)
					return message.reply("Vui lòng nhập url tiktok hợp lệ");
				const msgSend = message.reply(`Đang tải video: {{${data.desc}}}...`);
				const linksNoWatermark = data.links
					.filter(x => x.t.indexOf("(NO watermark)") > -1)
					.sort((a, b) => parseFloat(b.s.slice(0, b.s.indexOf(" "))) - parseFloat(a.s.slice(0, b.s.indexOf(" "))));
				const streamFile = await getStreamFromURL(linksNoWatermark[0].a);
				message.reply({
					body: `Đã tải video {{${data.desc}}}\nCaption: {{${data.desc}}}`,
					attachment: streamFile
				}, async () => message.unsend((await msgSend).messageID));
				break;
			}
			case "audio":
			case "a":
			case "-a": {
				const dataAudio = await query(args[1]);
				if (dataAudio.message)
					return message.reply(dataAudio.message);
				let urlAudio, audioName = '';
				if (dataAudio.music) {
					urlAudio = dataAudio.music.playUrl;
					audioName = dataAudio.music.title;
				}
				else {
					if (!dataAudio.links)
						return message.reply("Vui lòng nhập url tiktok hợp lệ");
					urlAudio = dataAudio.links.find(x => x.t.indexOf("MP3 Audio") > -1).a;
				}
				const msgSendAudio = message.reply(`Đang tải audio {{"${audioName}"}}...`);
				const streamFileAudio = await getStreamFromURL(urlAudio);
				message.reply({
					body: `Đã tải audio {{"${audioName}"}}`,
					attachment: streamFileAudio
				}, async () => message.unsend((await msgSendAudio).messageID));
				break;
			}
			default: {
				message.SynTaxError();
			}
		}
	}
};

async function query(url) {
	const result = (await axios.post("https://lovetik.com/api/ajax/search", qs.stringify({
		query: url
	}))).data;
	return result;
}