const { randomString, getTime, convertTime } = global.utils;
const { createCanvas } = require('canvas');
const rows = [
	{
		col: 4,
		row: 10,
		rewardPoint: 1
	},
	{
		col: 5,
		row: 12,
		rewardPoint: 2
	},
	{
		col: 6,
		row: 15,
		rewardPoint: 3
	}
];

module.exports = {
	config: {
		name: "guessnumber",
		aliases: ["guessnum"],
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Game đoán số",
			en: "Guess number game"
		},
		longDescription: {
			vi: "Game đoán số",
			en: "Guess number game"
		},
		category: "game",
		guide: {
			vi: "  {pn} [4 | 5 | 6] [single | multi]: tạo một bàn chơi mới, với:\n    4 5 6 là số chữ số của số cần đoán, mặc định là 4.\n    single | multi là chế độ chơi, single là 1 người chơi, multi là nhiều người chơi, mặc định là single.\n   Ví dụ:\n    {pn}\n    {pn} 4 single\n\n   Cách chơi: người chơi trả lời tin nhắn của bot theo quy tắc sau:\n   Bạn có 10 lần đoán (4 số), 12 lần (5 số), 15 lần (6 số).\n   Sau mỗi lần đoán, bạn sẽ nhận được thêm gợi ý là số lượng chữ số đúng (hiển thị bên trái) và số lượng chữ số đúng vị trí (hiển thị bên phải).\n   Lưu ý: Số được hình thành với các chữ số từ 0 đến 9, mỗi chữ số xuất hiện duy nhất một lần và số có thể đứng đầu là 0."
				+ "\n\n   {pn} rank <trang>: xem bảng xếp hạng."
				+ "\n   {pn} info [<uid> | <@tag> | <reply> | <để trống>]: xem thông tin xếp hạng của bạn hoặc người khác."
				+ "\n   {pn} reset: reset bảng xếp hạng (chỉ admin bot).",
			en: "  {pn} [4 | 5 | 6] [single | multi]: create a new game, with:\n    4 5 6 is the number of digits of the number to guess, default is 4.\n    single | multi is the game mode, single is 1 player, multi is multi player, default is single.\n   Example:\n    {pn}\n    {pn} 4 single\n\n   How to play: the player replies to the message of the bot with the following rules:\n   You have 10 guesses (4 numbers), 12 guesses (5 numbers), 15 guesses (6 numbers).\n   After each guess, you will get additional hints of the number of correct digits (shown on the left) and the number of correct digits (shown on the right).\n   Note: The number is formed with digits from 0 to 9, each digit appears only once and the number can start with 0."
				+ "\n\n   {pn} rank <page>: view the ranking."
				+ "\n   {pn} info [<uid> | <@tag> | <reply> | <empty>]: view your or other's ranking information."
				+ "\n   {pn} reset: reset the ranking (only admin bot)."
		}
	},

	langs: {
		vi: {
			charts: "🏆 | Bảng xếp hạng:\n%1",
			pageInfo: "Trang %1/%2",
			noScore: "⭕ | Hiện tại chưa có ai ghi điểm.",
			noPermissionReset: "⚠️ | Bạn không có quyền reset bảng xếp hạng.",
			notFoundUser: "⚠️ | Không tìm thấy người dùng có id %1 trong bảng xếp hạng.",
			userRankInfo: "🏆 | Thông tin xếp hạng:\nTên: %1\nĐiểm: %2\nSố lần chơi: %3\nSố lần thắng: %4\n%5\nSố lần thua: %6\nTỉ lệ thắng: %7%\nTổng thời gian chơi: %8",
			digits: "%1 chữ số: %2",
			resetRankSuccess: "✅ | Reset bảng xếp hạng thành công.",
			invalidCol: "⚠️ | Vui lòng nhập số chữ số của số cần đoán là 4, 5 hoặc 6",
			invalidMode: "⚠️ | Vui lòng nhập chế độ chơi là single hoặc multi",
			created: "✅ | Tạo bàn chơi thành công.",
			gameName: "GAME ĐOÁN SỐ",
			gameGuide: "⏳ | Cách chơi:\nBạn có %1 lần đoán.\nSau mỗi lần đoán, bạn sẽ nhận được thêm gợi ý là số lượng chữ số đúng (hiển thị bên trái) và số lượng chữ số đúng vị trí (hiển thị bên phải).",
			gameNote: "📄 | Lưu ý:\nSố được hình thành với các chữ số từ 0 đến 9, mỗi chữ số xuất hiện duy nhất một lần và số có thể đứng đầu là 0.",
			replyToPlayGame: "🎮 | Phản hồi tin nhắn hình ảnh bên dưới kèm theo %1 số bạn đoán để chơi game.",
			invalidNumbers: "⚠️ | Vui lòng nhập %1 số bạn muốn đoán",
			win: "🎉 | Chúc mừng bạn đã đoán đúng số %1 sau %2 lần đoán và nhận được %3 điểm thưởng.",
			loss: "🤦‍♂️ | Bạn đã thua, số đúng là %1."
		},
		en: {
			charts: "🏆 | Ranking:\n%1",
			pageInfo: "Page %1/%2",
			noScore: "⭕ | There is no one who has scored.",
			noPermissionReset: "⚠️ | You do not have permission to reset the ranking.",
			notFoundUser: "⚠️ | Could not find user with id %1 in the ranking.",
			userRankInfo: "🏆 | Ranking information:\nName: %1\nScore: %2\nNumber of games: %3\nNumber of wins: %4\n%5\nNumber of losses: %6\nWin rate: %7%\nTotal play time: %8",
			digits: "%1 digits: %2",
			resetRankSuccess: "✅ | Reset the ranking successfully.",
			invalidCol: "⚠️ | Please enter the number of digits of the number to guess is 4, 5 or 6",
			invalidMode: "⚠️ | Please enter the game mode is single or multi",
			created: "✅ | Create game successfully.",
			gameName: "GUESS NUMBER GAME",
			gameGuide: "⏳ | How to play:\nYou have %1 guesses.\nAfter each guess, you will get additional hints of the number of correct digits (shown on the left) and the number of correct digits (shown on the right).",
			gameNote: "📄 | Note:\nThe number is formed with digits from 0 to 9, each digit appears only once and the number can start with 0.",
			replyToPlayGame: "🎮 | Reply to the message below with the image of %1 numbers you guess to play the game.",
			invalidNumbers: "⚠️ | Please enter %1 numbers you want to guess",
			win: "🎉 | Congratulations you guessed the number %1 after %2 guesses and received %3 bonus points.",
			loss: "🤦‍♂️ | You lost, the correct number is %1."
		}
	},

	onStart: async function ({ message, event, getLang, commandName, args, globalData, usersData, role }) {
		if (args[0] == "rank") {
			const rankGuessNumber = await globalData.get("rankGuessNumber", "data", []);
			if (!rankGuessNumber.length)
				return message.reply(getLang("noScore"));

			const page = parseInt(args[1]) || 1;
			const maxUserOnePage = 30;

			let rankGuessNumberHandle = await Promise.all(rankGuessNumber.slice((page - 1) * maxUserOnePage, page * maxUserOnePage).map(async item => {
				const userName = await usersData.getName(item.id);
				return {
					...item,
					userName,
					winNumber: item.wins?.length || 0,
					lossNumber: item.losses?.length || 0
				};
			}));

			rankGuessNumberHandle = rankGuessNumberHandle.sort((a, b) => b.winNumber - a.winNumber);
			const medals = ["🥇", "🥈", "🥉"];
			const rankGuessNumberText = rankGuessNumberHandle.map((item, index) => {
				const medal = medals[index] || index + 1;
				return `${medal} ${item.userName} - ${item.winNumber} wins - ${item.lossNumber} losses`;
			}).join("\n");

			return message.reply(getLang("charts", rankGuessNumberText || getLang("noScore")) + "\n" + getLang("pageInfo", page, Math.ceil(rankGuessNumber.length / maxUserOnePage)));
		}
		else if (args[0] == "info") {
			const rankGuessNumber = await globalData.get("rankGuessNumber", "data", []);
			let targetID;
			if (Object.keys(event.mentions).length)
				targetID = Object.keys(event.mentions)[0];
			else if (event.messageReply)
				targetID = event.messageReply.senderID;
			else if (!isNaN(args[1]))
				targetID = args[1];
			else
				targetID = event.senderID;

			const userDataGuessNumber = rankGuessNumber.find(item => item.id == targetID);
			if (!userDataGuessNumber)
				return message.reply(getLang("notFoundUser", targetID));

			const userName = await usersData.getName(targetID);
			const pointsReceived = userDataGuessNumber.points;
			const winNumber = userDataGuessNumber.wins?.length || 0;
			const playNumber = winNumber + (userDataGuessNumber.losses?.length || 0);
			const lossNumber = userDataGuessNumber.losses?.length || 0;
			const winRate = (winNumber / playNumber * 100).toFixed(2);
			const winInfo = {};
			for (const item of userDataGuessNumber.wins || [])
				winInfo[item.col] = winInfo[item.col] ? winInfo[item.col] + 1 : 1;
			const playTime = convertTime(userDataGuessNumber.wins.reduce((a, b) => a + b.timeSuccess, 0) + userDataGuessNumber.losses.reduce((a, b) => a + b.timeSuccess, 0));
			return message.reply(getLang("userRankInfo", userName, pointsReceived, playNumber, winNumber, Object.keys(winInfo).map(item => `  + ${getLang("digits", item, winInfo[item])}`).join("\n"), lossNumber, winRate, playTime));
		}
		else if (args[0] == "reset") {
			if (role < 2)
				return message.reply(getLang("noPermissionReset"));
			await globalData.set("rankGuessNumber", [], "data");
			return message.reply(getLang("resetRankSuccess"));
		}

		const col = parseInt(args.join(" ").match(/(\d+)/)?.[1] || 4);
		const levelOfDifficult = rows.find(item => item.col == col);
		if (!levelOfDifficult)
			return message.reply(getLang("invalidCol"));
		const mode = args.join(" ").match(/(single|multi|-s|-m)/)?.[1] || "single";
		const row = levelOfDifficult.row || 10;

		const options = {
			col,
			row,
			timeStart: parseInt(getTime("x")),
			numbers: [],
			tryNumber: 0,
			ctx: null,
			canvas: null,
			answer: randomString(col, true, "0123456789"),
			gameName: getLang("gameName"),
			gameGuide: getLang("gameGuide", row),
			gameNote: getLang("gameNote")
		};

		const gameData = guessNumberGame(options);
		gameData.mode = mode;

		const messageData = message.reply(`${getLang("created")}\n\n${getLang("gameGuide", row)}\n\n${getLang("gameNote")}\n\n${getLang("replyToPlayGame", col)}`);
		gameData.messageData = messageData;

		message.reply({
			attachment: gameData.imageStream
		}, (err, info) => {
			global.GoatBot.onReply.set(info.messageID, {
				commandName,
				messageID: info.messageID,
				author: event.senderID,
				gameData
			});
		});
	},

	onReply: async ({ message, Reply, event, getLang, commandName, globalData }) => {
		const { gameData: oldGameData } = Reply;
		if (event.senderID != Reply.author && oldGameData.mode == "single")
			return;

		const numbers = (event.body || "").split("").map(item => item.trim()).filter(item => item != "" && !isNaN(item));
		if (numbers.length != oldGameData.col)
			return message.reply(getLang("invalidNumbers", oldGameData.col));
		global.GoatBot.onReply.delete(Reply.messageID);

		oldGameData.numbers = numbers;
		const gameData = guessNumberGame(oldGameData);

		if (gameData.isWin == null) {
			message.reply({
				attachment: gameData.imageStream
			}, (err, info) => {
				message.unsend(Reply.messageID);
				global.GoatBot.onReply.set(info.messageID, {
					commandName,
					messageID: info.messageID,
					author: event.senderID,
					gameData
				});
			});
		}
		else {
			const rankGuessNumber = await globalData.get("rankGuessNumber", "data", []);
			const rewardPoint = rows.find(item => item.col == gameData.col)?.rewardPoint || 0;
			const messageText = gameData.isWin ?
				getLang("win", gameData.answer, gameData.tryNumber - 1, rewardPoint) :
				getLang("loss", gameData.answer);
			message.unsend((await oldGameData.messageData).messageID);
			message.unsend(Reply.messageID);
			message.reply({
				body: messageText,
				attachment: gameData.imageStream
			});

			if (gameData.isWin != null) {
				const userIndex = rankGuessNumber.findIndex(item => item.id == event.senderID);
				const data = {
					tryNumber: gameData.tryNumber - 1,
					timeSuccess: parseInt(getTime("x") - oldGameData.timeStart),
					date: getTime(),
					col: gameData.col
				};

				if (gameData.isWin == true) {
					if (userIndex == -1)
						rankGuessNumber.push({
							id: event.senderID,
							wins: [data],
							losses: [],
							points: rewardPoint
						});
					else {
						rankGuessNumber[userIndex].wins.push(data);
						rankGuessNumber[userIndex].points += rewardPoint;
					}
				}
				else {
					delete data.tryNumber;
					if (userIndex == -1)
						rankGuessNumber.push({
							id: event.senderID,
							wins: [],
							losses: [data],
							points: 0
						});
					else
						rankGuessNumber[userIndex].losses.push(data);
				}
				await globalData.set("rankGuessNumber", rankGuessNumber, "data");
			}
		}
	}
};


function wrapTextGetHeight(ctx, text, maxWidth, lineHeight, margin = 0) {
	const lines = text.split('\n');
	let height = 0;
	let count = 0;
	for (let i = 0; i < lines.length; i++) {
		let line = '';
		const words = lines[i].split(' ');
		for (let n = 0; n < words.length; n++) {
			const textLine = line + words[n] + ' ';
			const textWidth = ctx.measureText(textLine).width;
			if (textWidth > maxWidth && n > 0) {
				line = words[n] + ' ';
				height += lineHeight;
				count++;
			}
			else {
				line = textLine;
			}
		}
		height += lineHeight;
		count++;
	}
	return height + margin * count;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
	const yStart = y;
	const lines = text.split('\n');
	for (let i = 0; i < lines.length; i++) {
		let line = '';
		const words = lines[i].split(' ');
		for (let n = 0; n < words.length; n++) {
			const textLine = line + words[n] + ' ';
			const metrics = ctx.measureText(textLine);
			const textWidth = metrics.width;
			if (textWidth > maxWidth && n > 0) {
				ctx.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			}
			else {
				line = textLine;
			}
		}
		ctx.fillText(line, x, y);
		y += lineHeight;
	}
	return y - yStart;
}

function drawBorderSquareRadius(ctx, x, y, width, height, radius = 5, lineWidth = 1, strokeStyle = '#000', fill) {
	ctx.save();
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
	if (fill) {
		ctx.fillStyle = strokeStyle;
		ctx.fill();
	}
	else {
		ctx.strokeStyle = strokeStyle;
		ctx.lineWidth = lineWidth;
		ctx.stroke();
	}
	ctx.restore();
}

function drawWrappedText(ctx, text, startY, wrapWidth, lineHeight, boldFirstLine, margin, marginText) {
	const splitText = text.split('\n');
	let y = startY;
	for (let i = 0; i < splitText.length; i++) {
		if (i === 0 && boldFirstLine)
			ctx.font = `bold ${ctx.font}`;
		else
			ctx.font = ctx.font.replace('bold ', '');
		const height = wrapText(ctx, splitText[i], margin / 2, y, wrapWidth, lineHeight);
		y += height + marginText;
	}
	return y;
}


function drawBorderSquareRadius(ctx, x, y, width, height, radius = 5, lineWidth = 1, strokeStyle = '#000', fill) {
	ctx.save();
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
	if (fill) {
		ctx.fillStyle = strokeStyle;
		ctx.fill();
	}
	else {
		ctx.strokeStyle = strokeStyle;
		ctx.lineWidth = lineWidth;
		ctx.stroke();
	}
	ctx.restore();
}

function drawWrappedText(ctx, text, startY, wrapWidth, lineHeight, boldFirstLine, margin, marginText) {
	const splitText = text.split('\n');
	let y = startY;
	for (let i = 0; i < splitText.length; i++) {
		if (i === 0 && boldFirstLine)
			ctx.font = `bold ${ctx.font}`;
		else
			ctx.font = ctx.font.replace('bold ', '');
		const height = wrapText(ctx, splitText[i], margin / 2, y, wrapWidth, lineHeight);
		y += height + marginText;
	}
	return y;
}

function getPositionOfSquare(x, y, sizeOfOneSquare, distance, marginX, marginY, lineWidth, heightGameName) {
	const xOutSide = marginX + x * (sizeOfOneSquare + distance) + lineWidth / 2;
	const yOutSide = marginY + y * (sizeOfOneSquare + distance) + lineWidth / 2 + heightGameName;
	const xInSide = xOutSide + lineWidth;
	const yInSide = yOutSide + lineWidth;

	return {
		xOutSide,
		yOutSide,
		xInSide,
		yInSide
	};
}

function guessNumberGame(options) {
	let { numbers, ctx, canvas, tryNumber, row, ctxNumbers, canvasNumbers, ctxHightLight, canvasHightLight } = options;
	const { col, answer, gameName, gameGuide, gameNote } = options;
	tryNumber--;
	if (Array.isArray(numbers))
		numbers = numbers.map(item => item.toString().trim());
	if (typeof numbers == 'string')
		numbers = numbers.split('').map(item => item.trim());

	if (numbers.length)
		options.allGuesss ? options.allGuesss.push(numbers) : options.allGuesss = [numbers];

	row = row || 10;

	const heightGameName = 40;
	const yGameName = 150;
	const sizeOfOneSquare = 100;
	const lineWidth = 6;
	const radius = 10;
	const distance = 10;
	const marginX = 150;
	const marginY = 100;
	const backgroundColor = '#F0F2F5';

	const fontGameGuide = '35px "Arial"';
	const fontGameName = 'bold 50px "Arial"';
	const fontNumbers = 'bold 60px "Arial"';
	const fontSuggest = 'bold 40px "Arial"';
	const fontResultWin = 'bold 150px "Times New Roman"';
	const fontResultLose = 'bold 150px "Arial"';
	const marginText = 2.9;
	const lineHeightGuideText = 38;

	if (!ctx && !canvas) {
		const xCanvas = col * sizeOfOneSquare + (col - 1) * distance + marginX * 2;
		canvas = createCanvas(1, 1);
		ctx = canvas.getContext('2d');
		ctx.font = fontGameGuide;

		const heightGameGuide = wrapTextGetHeight(ctx, gameGuide, xCanvas - marginX, lineHeightGuideText, marginText);
		const heightGameNote = wrapTextGetHeight(ctx, gameNote, xCanvas - marginX, lineHeightGuideText, marginText);
		const marginGuideNote = 10;

		canvas = createCanvas(
			col * sizeOfOneSquare + (col - 1) * distance + marginX * 2,
			heightGameName + row * sizeOfOneSquare + (row - 1) * distance + marginY * 2 + heightGameGuide + heightGameNote + marginGuideNote
		);
		ctx = canvas.getContext('2d');
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// draw game name
		ctx.font = fontGameName;
		ctx.fillStyle = '#404040';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(gameName, canvas.width / 2, yGameName / 2);

		// draw guide
		ctx.font = fontGameGuide;
		ctx.fillStyle = '#404040';
		ctx.textAlign = 'left';
		const yGuide = heightGameName + marginY / 2 + row * (sizeOfOneSquare + distance) + marginY / 2 + lineHeightGuideText * 2;

		// draw note
		const yNote = drawWrappedText(ctx, gameGuide, yGuide, canvas.width - marginX, lineHeightGuideText, true, marginX, marginText);

		drawWrappedText(ctx, gameNote, yNote + 10, canvas.width - marginX, lineHeightGuideText, true, marginX, marginText);

		// draw all squares
		for (let i = 0; i < col; i++) {
			for (let j = 0; j < row; j++) {
				const { xOutSide, yOutSide, xInSide, yInSide } = getPositionOfSquare(i, j, sizeOfOneSquare, distance, marginX, marginY, lineWidth, heightGameName);
				drawBorderSquareRadius(
					ctx,
					xOutSide,
					yOutSide,
					sizeOfOneSquare,
					sizeOfOneSquare,
					radius,
					lineWidth,
					'#919191',
					true
				);

				drawBorderSquareRadius(
					ctx,
					xInSide,
					yInSide,
					sizeOfOneSquare - lineWidth * 2,
					sizeOfOneSquare - lineWidth * 2,
					radius / 2,
					lineWidth,
					backgroundColor,
					true
				);
			}
		}
	}

	if (!canvasHightLight) {
		// if there's no canvasHightLight, then of course ctxHightLight, canvasNumbers and ctxNumbers doesn't either
		canvasHightLight = createCanvas(canvas.width, canvas.height);
		ctxHightLight = canvasHightLight.getContext('2d');
		canvasNumbers = createCanvas(canvas.width, canvas.height);
		ctxNumbers = canvasNumbers.getContext('2d');
	}

	// draw numbers
	let isWin = null;
	if (numbers.length) {
		ctxNumbers.font = fontNumbers;
		ctxNumbers.fillStyle = '#f0f0f0';
		ctxNumbers.textAlign = 'center';
		ctxNumbers.textBaseline = 'middle';
		for (let i = 0; i < col; i++) {
			const { xOutSide, yOutSide, xInSide, yInSide } = getPositionOfSquare(i, tryNumber, sizeOfOneSquare, distance, marginX, marginY, lineWidth, heightGameName);
			// draw background of square
			drawBorderSquareRadius(
				ctx,
				xInSide,
				yInSide,
				sizeOfOneSquare - lineWidth * 2,
				sizeOfOneSquare - lineWidth * 2,
				radius / 2,
				lineWidth,
				'#a3a3a3',
				true
			);
			// draw number
			const x = xOutSide + sizeOfOneSquare / 2;
			const y = yOutSide + sizeOfOneSquare / 2;
			ctxNumbers.fillText(numbers[i], x, y);

			// yellow || green 
			if (
				answer.includes(numbers[i]) // yellow (correct number)
				|| numbers[i] === answer[i] // green (correct number and position)
			) {
				drawBorderSquareRadius(
					ctxHightLight,
					xOutSide,
					yOutSide,
					sizeOfOneSquare,
					sizeOfOneSquare,
					radius,
					lineWidth,
					numbers[i] == answer[i] ? '#417642' : '#A48502',
					true
				);
				drawBorderSquareRadius(
					ctxHightLight,
					xInSide,
					yInSide,
					sizeOfOneSquare - lineWidth * 2,
					sizeOfOneSquare - lineWidth * 2,
					radius / 2,
					lineWidth,
					numbers[i] == answer[i] ? '#57AC58' : '#E9BE00',
					true
				);
			}
		}

		// After each guess, you will get additional hints of the number of correct digits (shown on the left) and the number of correct digits (shown on the right).
		let numberRight = 0;
		let numberRightPosition = 0;
		answer.split('').forEach((item, index) => {
			if (numbers.includes(item))
				numberRight++;
			if (item == numbers[index])
				numberRightPosition++;
		});

		ctx.font = fontSuggest;
		ctx.fillText(numberRight, marginX / 2, marginY + sizeOfOneSquare / 2 + heightGameName + tryNumber * (sizeOfOneSquare + distance));
		ctx.fillText(numberRightPosition, marginX + col * (sizeOfOneSquare) + distance * (col - 1) + marginX / 2, marginY + sizeOfOneSquare / 2 + heightGameName + tryNumber * (sizeOfOneSquare + distance));

		if (
			numberRight == answer.length && numberRightPosition == answer.length
			|| tryNumber + 1 == row
		) {
			isWin = numberRight == answer.length && numberRightPosition == answer.length;
			ctx.save();
			ctx.drawImage(canvasHightLight, 0, 0);
			ctx.drawImage(canvasNumbers, 0, 0);

			ctx.font = isWin ? fontResultWin : fontResultLose;
			ctx.fillStyle = isWin ? '#005900' : '#590000';
			// rotate -45 degree
			ctx.globalAlpha = 0.4;
			ctx.translate(canvas.width / 2, marginY + heightGameName + (row * (sizeOfOneSquare + distance)) / 2);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.rotate(-45 * Math.PI / 180);
			ctx.fillText(isWin ? 'YOU WIN' : answer.split('').join(' '), 0, 0);
			ctx.restore();
		}
		else {
			ctx.drawImage(canvasNumbers, 0, 0);
		}
	}

	tryNumber++;

	const imageStream = canvas.createPNGStream();
	imageStream.path = `guessNumber${Date.now()}.png`;

	return {
		...options,
		imageStream,
		ctx,
		canvas,
		tryNumber: tryNumber + 1,
		isWin,
		ctxHightLight,
		canvasHightLight,
		ctxNumbers,
		canvasNumbers
	};
}
