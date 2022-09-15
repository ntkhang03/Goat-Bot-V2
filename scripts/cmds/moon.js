const moment = require("moment-timezone");
const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const Canvas = require("canvas");
const https = require("https");
const agent = new https.Agent({
	rejectUnauthorized: false
});
const { getStreamFromURL } = global.utils;

const pathFont = __dirname + "/assets/font/Kanit-SemiBoldItalic.ttf";
Canvas.registerFont(pathFont, {
	family: "Kanit SemiBold"
});

function getLines(ctx, text, maxWidth) {
	const words = text.split(" ");
	const lines = [];
	let currentLine = words[0];
	for (let i = 1; i < words.length; i++) {
		const word = words[i];
		const width = ctx.measureText(currentLine + " " + word).width;
		if (width < maxWidth) {
			currentLine += " " + word;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}
	lines.push(currentLine);
	return lines;
}

function centerImage(ctx, img, x, y, sizeX, sizeY) {
	ctx.drawImage(img, x - sizeX / 2, y - sizeY / 2, sizeX, sizeY);
}

function checkDate(date) {
	if (moment(date, 'DD/MM/YYYY', true).isValid()) {
		const split = (date || "").split('/');
		const day = (split[0] || "").length == 1 ? "0" + split[0] : split[0];
		const month = (split[1] || "").length == 1 ? "0" + split[1] : split[1];
		const year = split[2] || "";
		const newDateFormat = year + "/" + month + "/" + day;
		return newDateFormat;
	}
	else return false;
}

module.exports = {
	config: {
		name: "moon",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "xem ảnh mặt trăng",
		longDescription: "xem ảnh mặt trăng vào đêm bạn chọn (dd/mm/yyyy)",
		category: "image",
		guide: "  {pn} <ngày/tháng/năm>"
			+ "\n   {pn} <ngày/tháng/năm> <caption>"
	},

	onStart: async function ({ args, message }) {
		const date = checkDate(args[0]);
		if (!date) return message.reply(`Vui lòng nhập ngày/tháng/năm hợp lệ theo định dạng DD/MM/YYYY`);
		const linkCrawl = "https://lunaf.com/lunar-calendar/" + date;

		let html;
		try {
			html = await axios.get(linkCrawl, { httpsAgent: agent });
		}
		catch (err) {
			return message.reply(`Đã xảy ra lỗi không thể lấy ảnh mặt trăng của ngày ${args[0]}`);
		}

		const $ = cheerio.load(html.data);
		const href = $("#moon-phase > div:nth-child(2) > figure > img").attr("src");
		const imgSrc = "https://lunaf.com/img/moon/h-" + href.slice(href.lastIndexOf("/") + 1);
		const { data: imgSrcBuffer } = await axios.get(imgSrc, {
			httpsAgent: agent
		});

		const msg = `- Ảnh mặt trăng vào đêm ${args[0]}`
			+ `\n- ${$($('h3').get()[0]).text()}`
			+ "\n- " + $("#phimg > small").text()
			+ `\n- ${linkCrawl}`
			+ "\n- " + imgSrc;

		if (args[1]) {
			const canvas = Canvas.createCanvas(1080, 2400);
			const ctx = canvas.getContext("2d");
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, 1080, 2400);

			const moon = await Canvas.loadImage(imgSrcBuffer);
			centerImage(ctx, moon, 1080 / 2, 2400 / 2, 970, 970);

			ctx.font = "60px \"Kanit SemiBold\"";
			const wrapText = getLines(ctx, args.slice(1).join(" "), 594);
			ctx.textAlign = "center";
			ctx.fillStyle = "white";

			const yStartText = 2095;//2042;
			//ctx.fillRect(0, 2042, 1080, 5);
			let heightText = yStartText - wrapText.length / 2 * 75;
			for (const text of wrapText) {
				ctx.fillText(text, 750, heightText);
				heightText += 75;
			}

			const pathSave = __dirname + "/tmp/wallMoon.png";
			fs.writeFileSync(pathSave, canvas.toBuffer());
			message.reply({
				body: msg,
				attachment: fs.createReadStream(pathSave)
			}, () => fs.unlinkSync(pathSave));
		}
		else {
			const streamImg = await getStreamFromURL(imgSrc, {
				httpsAgent: agent
			});
			message.reply({
				body: msg,
				attachment: streamImg
			});
		}
	}
};
