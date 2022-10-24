const axios = require("axios");
const ytdl = require("ytdl-core");
const qs = require("qs");
const https = require("https");
const agent = new https.Agent({
	rejectUnauthorized: false
});
const { getStreamFromURL, downloadFile } = global.utils;

module.exports = {
	config: {
		name: "ytb",
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "YouTube",
		longDescription: {
			vi: "Tải video, audio hoặc xem thông tin video trên YouTube",
			en: "Download video, audio or view video information on YouTube"
		},
		category: "media",
		guide: {
			vi: "   {pn} [video|-v] [<tên video>|<link video>]: dùng để tải video từ youtube."
				+ "\n   {pn} [audio|-a] [<tên video>|<link video>]: dùng để tải audio từ youtube"
				+ "\n   {pn} [info|-i] [<tên video>|<link video>]: dùng để xem thông tin video từ youtube"
				+ "\n   Ví dụ:"
				+ "\n    {pn} -v Fallen Kingdom"
				+ "\n    {pn} -a Fallen Kingdom"
				+ "\n    {pn} -i Fallen Kingdom",
			en: "   {pn} [video|-v] [<video name>|<video link>]: use to download video from youtube."
				+ "\n   {pn} [audio|-a] [<video name>|<video link>]: use to download audio from youtube"
				+ "\n   {pn} [info|-i] [<video name>|<video link>]: use to view video information from youtube"
				+ "\n   Example:"
				+ "\n    {pn} -v Fallen Kingdom"
				+ "\n    {pn} -a Fallen Kingdom"
				+ "\n    {pn} -i Fallen Kingdom"
		}
	},

	langs: {
		vi: {
			error: "Đã xảy ra lỗi: %1",
			noResult: "Không có kết quả tìm kiếm nào phù hợp với từ khóa %1",
			choose: "%1Reply tin nhắn với số để chọn hoặc nội dung bất kì để gỡ",
			downloading: "Đang tải xuống video %1",
			noVideo: "Rất tiếc, không tìm thấy video nào có dung lượng nhỏ hơn 83MB",
			downloadingAudio: "Đang tải xuống audio %1",
			noAudio: "Rất tiếc, không tìm thấy audio nào có dung lượng nhỏ hơn 26MB",
			info: "💠 Tiêu đề: %1\n🏪 Channel: %2\n👨‍👩‍👧‍👦 Subscriber: %3\n⏱ Thời gian video: %4\n👀 Lượt xem: %5\n👍 Lượt thích: %6\n👎 Không thích: %7\n🆙 Ngày tải lên: %8\n#️⃣ ID: %9"
		},
		en: {
			error: "An error has occurred: %1",
			noResult: "No search results match the keyword %1",
			choose: "%1Reply to the message with the number to choose or any content to cancel",
			downloading: "Downloading video %1",
			noVideo: "Sorry, no video was found with a size less than 83MB",
			downloadingAudio: "Downloading audio %1",
			noAudio: "Sorry, no audio was found with a size less than 26MB",
			info: "💠 Title: %1\n🏪 Channel: %2\n👨‍👩‍👧‍👦 Subscriber: %3\n⏱ Video duration: %4\n👀 View count: %5\n👍 Like count: %6\n👎 Dislike count: %7\n🆙 Upload date: %8\n#️⃣ ID: %9"
		}
	},

	onStart: async function ({ args, message, event, commandName, getLang }) {
		let type;
		switch (args[0]) {
			case "-v":
			case "video":
				type = "video";
				break;
			case "-a":
			case "-s":
			case "audio":
			case "sing":
				type = "audio";
				break;
			case "-i":
			case "info":
				type = "info";
				break;
			default:
				return message.SyntaxError();
		}

		const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		const urlYtb = checkurl.test(args[1]);

		if (urlYtb) {
			const infoVideo = await ytdl.getInfo(args[1]);
			handle({ type, infoVideo, message, downloadFile, getLang });
			return;
		}

		const keyWord = args.slice(1).join(" ");
		const maxResults = 6;

		let result;
		try {
			result = (await search(keyWord)).slice(0, maxResults);
		}
		catch (err) {
			return message.reply(getLang("error", err.message));
		}
		if (result.length == 0)
			return message.reply(getLang("noResult", keyWord));
		let msg = "";
		let i = 1;
		const thumbnails = [];
		const arrayID = [];

		for (const info of result) {
			thumbnails.push(getStreamFromURL(info.thumbnail));
			msg += `${i++}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
		}

		message.reply({
			body: getLang("choose", msg),
			attachment: await Promise.all(thumbnails)
		}, (err, info) => {
			global.GoatBot.onReply.set(info.messageID, {
				commandName,
				messageID: info.messageID,
				author: event.senderID,
				arrayID,
				result,
				type
			});
		});
	},

	onReply: async ({ event, api, Reply, message, getLang }) => {
		const { result, type } = Reply;
		const choice = event.body;
		if (!isNaN(choice) && choice <= 6) {
			const infoChoice = result[choice - 1];
			const idvideo = infoChoice.id;
			const infoVideo = await ytdl.getInfo(idvideo);
			api.unsendMessage(Reply.messageID);
			await handle({ type, infoVideo, message, getLang });
		}
		else
			api.unsendMessage(Reply.messageID);
	}
};

async function handle({ type, infoVideo, message, getLang }) {
	const { video_url } = infoVideo.videoDetails;

	if (type == "video") {
		const MAX_SIZE = 87031808; // 83MB
		const msgSend = message.reply(getLang("downloading", infoVideo.videoDetails.title));
		const formats = await getFormatsUrl(video_url);
		const getFormat = (formats.find(f => f.type === "mp4").qualitys.filter(f => f.size < MAX_SIZE) || [])[0];
		if (!getFormat)
			return message.reply(getLang("noVideo"));
		const stream = await getStreamFromURL(getFormat.dlink, `${infoVideo.videoDetails.title}.mp4`, { httpsAgent: agent });
		message.reply({
			body: `${infoVideo.videoDetails.title}`,
			attachment: stream
		}, async () => message.unsend((await msgSend).messageID));
	}
	else if (type == "audio") {
		const MAX_SIZE = 26000000; // 26MB
		const msgSend = message.reply(getLang("downloadingAudio", infoVideo.videoDetails.title));
		const formats = await getFormatsUrl(video_url);
		const getFormat = (formats.find(f => f.type === "mp3").qualitys.filter(f => f.size < MAX_SIZE) || [])[0];
		if (!getFormat)
			return message.reply(getLang("noAudio"));
		const stream = await getStreamFromURL(getFormat.dlink, `${infoVideo.videoDetails.title}.mp3`, { httpsAgent: agent });
		message.reply({
			body: `${infoVideo.videoDetails.title}`,
			attachment: stream
		}, async () => message.unsend((await msgSend).messageID));
	}
	else if (type == "info") {
		const info = infoVideo.videoDetails;
		const { title, lengthSeconds, viewCount, videoId, uploadDate, likes, dislikes, chapters } = infoVideo.videoDetails;

		const hours = Math.floor(lengthSeconds / 3600);
		const minutes = Math.floor(lengthSeconds % 3600 / 60);
		const seconds = Math.floor(lengthSeconds % 3600 % 60);
		const msg = getLang("info", info.author.name, (info.author.subscriber_count || 0), `${hours}:${minutes}:${seconds}`, viewCount, likes, dislikes, uploadDate, videoId);
		// if (chapters.length > 0) {
		//     msg += "\n📋 Danh sách phân đoạn:\n"
		//         + chapters.reduce((acc, cur) => {
		//             const time = convertTime(cur.start_time * 1000, ':', ':', ':').slice(0, -1);
		//             return acc + ` ${time} => ${cur.title}\n`;
		//         }, '');
		// }

		message.reply({
			body: msg,
			attachment: [
				await getStreamFromURL(info.thumbnail),
				await getStreamFromURL(info.channel.thumbnail)
			]
		});
	}
}


async function getFormatsUrl(url) {
	const response = await axios.post("https://9convert.com/api/ajaxSearch/index", qs.stringify({
		query: url,
		vt: "home"
	}));

	const videoId = response.data.vid;
	const { data } = response;
	for (const key in data.links) {
		for (const key2 in data.links[key]) {
			data.links[key][key2] = {
				...data.links[key][key2],
				dataConvert: convert(videoId, data.links[key][key2].k)
			};
		}
	}

	for (const key in data.links) {
		for (const key2 in data.links[key]) {
			data.links[key][key2] = { ...data.links[key][key2], ...(await data.links[key][key2].dataConvert) };
			delete data.links[key][key2].dataConvert;
		}
	}

	// format data to array
	const linksFormat = [];
	for (const key in data.links) {
		const qualitys = [];
		for (const key2 in data.links[key]) {
			const format = data.links[key][key2];

			let size;
			if (format.size.includes("KB"))
				size = parseInt(format.size.replace("KB", "")) * 1024;
			if (format.size.includes("MB"))
				size = parseInt((format.size.match(/\d+/) || ['0'])[0]) * 1024 * 1024;
			if (format.size.includes("GB"))
				size = parseInt((format.size.match(/\d+/) || ['0'])[0]) * 1024 * 1024 * 1024;

			qualitys.push({
				size,
				dlink: format.dlink,
				f: format.f,
				q: format.d,
				ftype: format.ftype
			});
		}

		qualitys.sort((a, b) => a.size + b.size);

		linksFormat.push({
			type: key,
			qualitys
		});
	}

	data.links = linksFormat.sort((a, b) => b.size - a.size);
	return data.links;
}

function convert(videoId, k) {
	return new Promise((resolve, reject) => {
		axios.post("https://9convert.com/api/ajaxConvert/convert", qs.stringify({
			vid: videoId,
			k
		}))
			.then(res => resolve(res.data))
			.catch(err => reject(err));
	});
}

async function search(keyWord) {
	try {
		const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyWord)}`;
		const res = await axios.get(url);
		const video = JSON.parse(res.data.split("ytInitialData = ")[1].split(";</script>")[0]);
		return video.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents.filter(item => item.videoRenderer).map(item => {
			return {
				id: item.videoRenderer.videoId,
				title: item.videoRenderer.title.runs[0].text,
				thumbnail: item.videoRenderer.thumbnail.thumbnails.pop().url,
				time: item.videoRenderer.lengthText.simpleText,
				channel: {
					id: item.videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId,
					name: item.videoRenderer.ownerText.runs[0].text,
					thumbnail: item.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails.pop().url.replace(/s[0-9]+\-c/g, '-c')
				}
			};
		});
	}
	catch (e) {
		const error = new Error("Cannot search video");
		error.code = "SEARCH_VIDEO_ERROR";
		throw error;
	}
}