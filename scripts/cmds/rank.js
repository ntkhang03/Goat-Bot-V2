const Canvas = require("canvas");
const jimp = require("jimp");
const fs = require("fs-extra");

const defaultFontName = "BeVietnamPro-SemiBold";
const defaultPathFontName = __dirname + "/assets/font/BeVietnamPro-SemiBold.ttf";
const percentage = total => total / 100;

Canvas.registerFont(__dirname + "/assets/font/BeVietnamPro-Bold.ttf", {
	family: "BeVietnamPro-Bold"
});
Canvas.registerFont(defaultPathFontName, {
	family: defaultFontName
});

let deltaNext;
const expToLevel = exp => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
const levelToExp = level => Math.floor(((Math.pow(level, 2) - level) * deltaNext) / 2);

module.exports = {
	config: {
		name: "rank",
		version: "1.2",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Xem level của người dùng",
			en: "View level of user"
		},
		longDescription: {
			vi: "Xem level của bạn hoặc người được tag. Có thể tag nhiều người",
			en: "View your level or the level of the tagged person. You can tag many people"
		},
		category: "rank",
		guide: "{pn} [để trống | @tags]",
		envConfig: {
			deltaNext: 5
		}
	},

	onStart: async function ({ message, event, usersData, threadsData, commandName, envCommands }) {
		deltaNext = envCommands[commandName].deltaNext;
		let targetUsers;
		const arrayMentions = Object.keys(event.mentions);

		if (arrayMentions.length == 0)
			targetUsers = [event.senderID];
		else
			targetUsers = arrayMentions;

		for (const userID of targetUsers) {
			const { exp } = await usersData.get(userID);
			const levelUser = expToLevel(exp);

			const expNextLevel = levelToExp(levelUser + 1) - levelToExp(levelUser);
			const currentExp = expNextLevel - (levelToExp(levelUser + 1) - exp);

			const allUser = usersData.getAll();
			allUser.sort((a, b) => b.exp - a.exp);
			const rank = allUser.findIndex(user => user.userID == userID) + 1;

			const defaultDesignCard = {
				widthCard: 2000,
				heightCard: 500,
				main_color: "#474747",
				sub_color: "rgba(255, 255, 255, 0.5)",
				alpha_subcard: 0.9,
				exp_color: "#e1e1e1",
				expNextLevel_color: "#3f3f3f",
				text_color: "#000000"
			};

			const customRankCard = await threadsData.get(event.threadID, "data.customRankCard") || {};
			const dataLevel = {
				exp: currentExp,
				expNextLevel,
				name: allUser[rank - 1].name,
				rank: `#${rank}/${allUser.length}`,
				level: levelUser,
				avatar: await usersData.getAvatarUrl(userID)
			};

			const image = await makeRankCard({
				...defaultDesignCard,
				...customRankCard,
				...dataLevel
			});
			const pathSave = `${__dirname}/tmp/rankcard_${userID}.png`;
			fs.writeFileSync(pathSave, image);
			message.reply({
				attachment: fs.createReadStream(pathSave)
			}, () => {
				if (fs.existsSync(pathSave))
					fs.unlinkSync(pathSave);
			});
		}
	},

	onChat: async function ({ usersData, event }) {
		let { exp } = await usersData.get(event.senderID);
		if (isNaN(exp))
			exp = 0;
		try {
			await usersData.set(event.senderID, {
				exp: exp + 1
			});
		}
		catch (e) { }
	}
};


async function makeRankCard(data) {
	try {
		let {
			widthCard,
			heightCard
		} = data;
		const {
			main_color,
			sub_color,
			alpha_subcard,
			exp_color,
			expNextLevel_color,
			text_color,
			exp,
			expNextLevel,
			name,
			level,
			rank,
			avatar
		} = data;


		widthCard = parseInt(widthCard);
		heightCard = parseInt(heightCard);
		const canvas = Canvas.createCanvas(widthCard, heightCard);
		const ctx = canvas.getContext("2d");

		// Draw main card
		await checkColorOrImageAfterDraw(0, 0, widthCard, heightCard, ctx, main_color || "", 20);
		// Draw sub card
		const subCard = await makeSubCard(widthCard, heightCard, avatar, sub_color, widthCard, heightCard, alpha_subcard, expNextLevel_color, exp_color, expNextLevel, exp);
		ctx.drawImage(await Canvas.loadImage(subCard), 0, 0);

		const maxSizeFont_Name = 4 * percentage(widthCard);
		const maxSizeFont_Exp = 2 * percentage(widthCard);
		const maxSizeFont_Level = 3.25 * percentage(widthCard);
		const maxSizeFont_Rank = 4 * percentage(widthCard);

		ctx.fillStyle = text_color;

		ctx.textAlign = "end";
		ctx.font = autoSizeFont(18.4 * percentage(widthCard), maxSizeFont_Rank, rank, ctx, "BeVietnamPro-Bold");

		ctx.fillText(rank, 94 * percentage(widthCard), 76 * percentage(heightCard));

		const textLevel = "Lv " + level;
		ctx.font = autoSizeFont(9.8 * percentage(widthCard), maxSizeFont_Level, textLevel, ctx, "BeVietnamPro-Bold");
		ctx.fillText(textLevel, 94 * percentage(widthCard), 32 * percentage(heightCard));

		ctx.font = autoSizeFont(52.1 * percentage(widthCard), maxSizeFont_Name, name, ctx, defaultFontName);
		ctx.textAlign = "center";
		// Name
		ctx.fillText(name, 47.5 * percentage(widthCard), 40 * percentage(heightCard));

		// Exp
		const textExp = "Exp " + exp + "/" + expNextLevel;
		ctx.font = autoSizeFont(49 * percentage(widthCard), maxSizeFont_Exp, textExp, ctx, "BeVietnamPro-Bold");
		ctx.fillText(textExp, 47.5 * percentage(widthCard), 61.4 * percentage(heightCard));
		return canvas.toBuffer();
	}
	catch (err) {
		throw err;
	}
}

function centerImage(ctx, img, xCenter, yCenter, w, h) {
	const x = xCenter - w / 2;
	const y = yCenter - h / 2;
	ctx.drawImage(img, x, y, w, h);
}

function autoSizeFont(maxWidthText, maxSizeFont, text, ctx, fontName) {
	let sizeFont = 0;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		sizeFont += 1;
		ctx.font = sizeFont + "px " + fontName;
		const widthText = ctx.measureText(text).width;
		if (widthText > maxWidthText || sizeFont > maxSizeFont) break;
	}
	return sizeFont + "px " + fontName;
}

function drawSquareRounded(ctx, x, y, w, h, r, color) {
	ctx.save();
	if (w < 2 * r)
		r = w / 2;
	if (h < 2 * r)
		r = h / 2;
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
	ctx.restore();
}

function roundedImage(x, y, width, height, radius, ctx) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}

function isUrl(colorOrImage) {
	const res = colorOrImage.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
	if (res == null) return false;
	else return true;
}

async function checkColorOrImageAfterDraw(xStart, yStart, width, height, ctx, colorOrImage, r) {
	if (!isUrl(colorOrImage)) {
		drawSquareRounded(ctx, xStart, yStart, width, height, r, colorOrImage);
	}
	else {
		const imageLoad = await Canvas.loadImage(colorOrImage);
		ctx.save();
		roundedImage(xStart, yStart, width, height, r, ctx);
		ctx.clip();
		ctx.drawImage(imageLoad, xStart, yStart, width, height);
		ctx.restore();
	}
}

async function makeSubCard(widthMainCard, heightMainCard, avatar, colorOrImage, widthCard, heightCard, alpha_subcard, expNextLevel_color, exp_color, expNextLevel, exp) {
	const canvas = Canvas.createCanvas(widthMainCard, heightMainCard);
	const ctx = canvas.getContext("2d");

	const alignRim = 3 * percentage(widthCard);
	// Draw sub card
	let Alpha;
	if (typeof alpha_subcard == "undefined") Alpha = 1;
	else Alpha = parseFloat(alpha_subcard);

	ctx.globalAlpha = Alpha;
	await checkColorOrImageAfterDraw(alignRim, alignRim, widthMainCard - alignRim * 2, heightMainCard - alignRim * 2, ctx, colorOrImage, 20, alpha_subcard);
	ctx.globalAlpha = 1;

	ctx.globalCompositeOperation = "destination-out";

	const xyAvatar = heightMainCard / 2;
	const resizeAvatar = 60 * percentage(heightMainCard);

	// Kẽ đường ngang ở giữa
	const widthLineBetween = 58 * percentage(widthMainCard);
	const heightLineBetween = 2 * percentage(heightMainCard);
	drawSquareRounded(ctx, xyAvatar + resizeAvatar / 2, heightMainCard / 2 - heightLineBetween / 2, widthLineBetween, heightLineBetween, 20, "#000000");

	const angleLineCenter = 40;
	const edge = heightMainCard / 2 * Math.tan(angleLineCenter * Math.PI / 180);

	ctx.beginPath();
	ctx.moveTo(xyAvatar + resizeAvatar / 2 + widthLineBetween + edge, 0);
	ctx.lineTo(xyAvatar + resizeAvatar / 2 + widthLineBetween - edge, heightMainCard);
	ctx.lineWidth = heightLineBetween;
	ctx.stroke();

	// Xóa nền vị trí đặt avatar
	ctx.beginPath();
	ctx.arc(xyAvatar, xyAvatar, resizeAvatar / 2 + heightLineBetween, 0, 2 * Math.PI);
	ctx.fill();

	// Xóa nền tại vị trí đặt thanh Exp
	const radius = 6 * percentage(heightCard);
	const xStartExp = (25 + 1.5) * percentage(widthCard),
		yStartExp = 67 * percentage(heightCard),
		widthExp = 40.5 * percentage(widthCard),
		heightExp = radius * 2;

	function drawMaxExp(color) {
		ctx.beginPath();
		ctx.fillStyle = color || "#000000";
		ctx.arc(xStartExp, yStartExp + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, true);
		ctx.fill();
		ctx.fillRect(xStartExp, yStartExp, widthExp, heightExp);
		ctx.arc(xStartExp + widthExp, yStartExp + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, false);
		ctx.fill();
	}
	drawMaxExp();

	ctx.globalCompositeOperation = "source-over";
	// Vẽ avatar
	const readAvatar = await jimp.read(avatar);
	readAvatar.circle();
	avatar = await readAvatar.getBufferAsync("image/png");
	centerImage(ctx, await Canvas.loadImage(avatar), xyAvatar, xyAvatar, resizeAvatar, resizeAvatar);

	// Vẽ Exp
	// Max Exp
	drawMaxExp(expNextLevel_color);
	// Current Exp
	ctx.fillStyle = exp_color;

	ctx.beginPath();
	ctx.arc(xStartExp, yStartExp + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, true);
	ctx.fill();

	const widthExpCurrent = (100 / expNextLevel * exp) * percentage(widthExp);
	ctx.fillRect(xStartExp, yStartExp, widthExpCurrent, heightExp);

	ctx.beginPath();
	ctx.arc(xStartExp + widthExpCurrent - 1, yStartExp + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI);
	ctx.fill();

	return canvas.toBuffer();
}
