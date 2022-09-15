const axios = require("axios");
const ytdl = require("ytdl-core");
const qs = require("qs");
const { getStreamFromURL, downloadFile } = global.utils;

module.exports = {
	config: {
		name: "ytb",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "YouTube",
		longDescription: "Tải video, audio hoặc xem thông tin video trên YouTube",
		category: "media",
		guide: "{pn} {{[video|-v]}} [<tên video>|<link video>]: dùng để tải video từ youtube."
			+ "\n{pn} {{[audio|-a]}} [<tên video>|<link video>]: dùng để tải audio từ youtube"
			+ "\n{pn} {{[info|-i]}} [<tên video>|<link video>]: dùng để xem thông tin video từ youtube"
			+ "\nVí dụ:"
			+ "\n   {pn} {{-v Fallen Kingdom}}"
			+ "\n   {pn} {{-a Fallen Kingdom}}"
			+ "\n   {pn} {{-i Fallen Kingdom}}",
		envGlobal: {
			youtube: "AIzaSyBZjYk2QtAvsZjAzUJ5o4qGl8eRl6gr2SA"
		}
	},

	onStart: async function ({ args, message, event, commandName, envGlobal }) {
		const API_KEY = envGlobal.youtube;
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
			handle({ type, infoVideo, message, downloadFile });
			return;
		}

		const keyWord = args.slice(1).join(" ");
		const maxResults = 6;
		const url = encodeURI(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&q=${keyWord}&maxResults=${maxResults}&type=video`);
		let result;
		try {
			result = (await axios.get(url)).data;
		}
		catch (err) {
			return message.reply(`Đã xảy ra lỗi: {{${err.response.data.error.message}}}`);
		}
		result = result.items;
		if (result.length == 0)
			return message.reply(`Không có kết quả tìm kiếm nào phù hợp với từ khóa {{${keyWord}}}`);
		let msg = "";
		let i = 1;
		const thumbnails = [];
		const arrayID = [];

		for (const info of result) {
			const { videoId } = info.id;
			const infoWithApi = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoId}&key=${API_KEY}`)).data.items[0];
			const time = infoWithApi.contentDetails.duration.slice(2).toLowerCase();
			const listthumbnails = Object.values(infoWithApi.snippet.thumbnails);
			const linkthumbnails = listthumbnails[listthumbnails.length - 1].url;
			thumbnails.push(getStreamFromURL(linkthumbnails));
			msg += `{{${i++}. ${info.snippet.title}}}\nTime: ${time}\n\n`;
		}

		message.reply({
			body: `${msg}Reply tin nhắn với số để chọn hoặc nội dung bất kì để gỡ`,
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

	onReply: async ({ event, api, Reply, message }) => {
		const { result, type } = Reply;
		const choice = event.body;
		if (!isNaN(choice) && choice <= 6) {
			const infoChoice = result[choice - 1];
			const idvideo = infoChoice.id.videoId;
			const infoVideo = await ytdl.getInfo(idvideo);
			api.unsendMessage(Reply.messageID);
			await handle({ type, infoVideo, message });
		}
		else
			api.unsendMessage(Reply.messageID);
	}
};

async function handle({ type, infoVideo, message }) {
	const { video_url } = infoVideo.videoDetails;

	if (type == "video") {
		const MAX_SIZE = 87031808; // 83MB
		const msgSend = message.reply(`Đang tải xuống video {{${infoVideo.videoDetails.title}}}`);
		const formats = await getFormatsUrl(video_url);
		const getFormat = (formats.find(f => f.type === "mp4").qualitys.filter(f => f.size < MAX_SIZE) || [])[0];
		if (!getFormat)
			return message.reply("Rất tiếc, không tìm thấy video nào có dung lượng nhỏ hơn 83MB");
		const stream = await getStreamFromURL(getFormat.dlink, `${infoVideo.videoDetails.title}.mp4`);
		message.reply({
			body: `{{${infoVideo.videoDetails.title}}}`,
			attachment: stream
		}, async () => message.unsend((await msgSend).messageID));
	}
	else if (type == "audio") {
		const MAX_SIZE = 26000000; // 26MB
		const msgSend = message.reply(`Đang tải xuống audio {{${infoVideo.videoDetails.title}}}`);
		const formats = await getFormatsUrl(video_url);
		const getFormat = (formats.find(f => f.type === "mp3").qualitys.filter(f => f.size < MAX_SIZE) || [])[0];
		if (!getFormat)
			return message.reply("Rất tiếc, không tìm thấy audio nào có dung lượng nhỏ hơn 26MB");
		const stream = await getStreamFromURL(getFormat.dlink);
		message.reply({
			body: `{{${infoVideo.videoDetails.title}}}`,
			attachment: stream
		}, async () => message.unsend((await msgSend).messageID));
	}
	else if (type == "info") {
		const info = infoVideo.videoDetails;
		const { title, lengthSeconds, viewCount, videoId, uploadDate, likes, dislikes, chapters } = infoVideo.videoDetails;

		const hours = Math.floor(lengthSeconds / 3600);
		const minutes = Math.floor(lengthSeconds % 3600 / 60);
		const seconds = Math.floor(lengthSeconds % 3600 % 60);
		const msg = "💠 Tiêu đề: " + title
			+ "\n🏪 Channel: " + info.author.name
			+ "\n👨‍👩‍👧‍👦 Subscriber: " + (info.author.subscriber_count || 0)
			+ `\n⏱ Thời gian video: ${hours}:${minutes}:${seconds}`
			+ "\n👀 Lượt xem: " + viewCount
			+ "\n👍 Lượt thích: " + likes
			+ "\n👎 Không thích: " + dislikes
			+ "\n🆙 Ngày tải lên: " + uploadDate
			+ "\n#️⃣ ID: " + videoId;
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
				await getStreamFromURL(info.thumbnails[info.thumbnails.length - 1].url),
				await getStreamFromURL(info.author.thumbnails[info.author.thumbnails.length - 1].url)
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