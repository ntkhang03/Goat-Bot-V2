module.exports = {
    config: {
        name: "frogjump",
        version: "1.0",
        author: "Vex_Kshitiz",
        shortDescription: "Play the frog jump game.",
        longDescription: "A game where you jump a frog over snakes.",
        category: "game",
        guide: {
            en: "{p}frogjump first choose box between 13 14 15 16 than 9 10 11 12 han 5 6 7 8 and finally first row 1 2 3 4"
        }
    },

    onStart: async function ({ event, message, api, usersData }) {
        try {
            const board = generateInitialBoard();
            const sentMessage = await message.reply(board);
            global.FrogGame = {
                currentMessageID: sentMessage.messageID,
                initiator: event.senderID,
                frogPosition: null,
                snakePositions: generateSnakePositions(),
                gameOver: false,
                win: false
            };
        } catch (error) {
            console.error("Error", error);
        }
    },

    onChat: async function ({ event, message, api, usersData }) {
        try {
            if (!global.FrogGame || global.FrogGame.gameOver || event.senderID !== global.FrogGame.initiator) return;

            const chosenBox = parseInt(event.body.trim());
            if (isNaN(chosenBox) || chosenBox < 1 || chosenBox > 16) {
                return;
            }

            if (!isValidMove(chosenBox)) {
                return;
            }

            await moveFrog(chosenBox, message, api, usersData);
        } catch (error) {
            console.error("Error in frogjump command:", error);
        }
    }
};

function generateInitialBoard() {
    let board = "";
    for (let i = 1; i <= 16; i++) {
        board += "⬛ ";
        if (i % 4 === 0) {
            board += "\n";
        }
    }
    return board.trim();
}

function generateSnakePositions() {
    const snakePositions = [];
    while (snakePositions.length < 8) {
        const position = Math.floor(Math.random() * 16) + 1;
        if (!snakePositions.includes(position)) {
            snakePositions.push(position);
        }
    }
    return snakePositions;
}

function isValidMove(chosenBox) {
    const frogPosition = global.FrogGame.frogPosition;

    if (frogPosition === null) {
        return [13, 14, 15, 16].includes(chosenBox);
    } else if ([13, 14, 15, 16].includes(frogPosition)) {
        return [9, 10, 11, 12].includes(chosenBox);
    } else if ([9, 10, 11, 12].includes(frogPosition)) {
        return [5, 6, 7, 8].includes(chosenBox);
    } else {
        return [1, 2, 3, 4].includes(chosenBox);
    }
}

async function moveFrog(chosenBox, message, api, usersData) {
    const { frogPosition, snakePositions } = global.FrogGame;

    if (snakePositions.includes(chosenBox)) {
        let coinsEarned = 0;
        let gameOverMessage = "❌| Game over! frog landed on a snake.";

        if (frogPosition >= 13 && frogPosition <= 16) {
            coinsEarned = 20000;
        } else if (frogPosition >= 9 && frogPosition <= 12) {
            coinsEarned = 30000;
        } else if (frogPosition >= 5 && frogPosition <= 8) {
            coinsEarned = 40000;
        } else if (frogPosition >= 1 && frogPosition <= 4) {
            coinsEarned = 10000;
        }

        if (coinsEarned > 0) {
            gameOverMessage = `☺opps frogs got eaten by snake.\nbut you earned ${coinsEarned} coins.`;
            const senderID = global.FrogGame.initiator;
            const userData = await usersData.get(senderID);
            const updatedMoney = userData.money + coinsEarned;
            await usersData.set(senderID, { money: updatedMoney });
        }

        global.FrogGame.gameOver = true;
        const gameOverBoard = revealSnakeBox(chosenBox);
        await api.editMessage(gameOverBoard, global.FrogGame.currentMessageID);
        return message.reply(gameOverMessage);
    }

    global.FrogGame.frogPosition = chosenBox;

    if (chosenBox <= 4 && !snakePositions.includes(chosenBox)) {
        global.FrogGame.win = true;
        global.FrogGame.gameOver = true;

        const winnerBoard = generateBoard(chosenBox);
        const senderID = global.FrogGame.initiator;
        const userData = await usersData.get(senderID);
        const updatedMoney = userData.money + 100000;
        await usersData.set(senderID, { money: updatedMoney });

        const sentMessage = await message.reply("🥳Congratulations! You won 1 lakh coins!");
        if (global.FrogGame.currentMessageID) {
            try {
                await message.unsend(global.FrogGame.currentMessageID);
            } catch (error) {
                console.error("Error while unsending message:", error);
            }
        }
        global.FrogGame.currentMessageID = sentMessage.messageID;
    }

    const board = generateBoard(chosenBox);
    const sentMessage = await message.reply(board);
    if (global.FrogGame.currentMessageID) {
        try {
            await message.unsend(global.FrogGame.currentMessageID);
        } catch (error) {
            console.error("Error while unsending message:", error);
        }
    }
    global.FrogGame.currentMessageID = sentMessage.messageID;
}

function revealSnakeBox(chosenBox) {
    let board = "";
    for (let i = 1; i <= 16; i++) {
        if (i === chosenBox) {
            board += "🐍 ";
        } else {
            board += "⬛ ";
        }
        if (i % 4 === 0) {
            board += "\n";
        }
    }
    return board.trim();
}

function generateBoard(frogPosition = null) {
    let board = "";
    for (let i = 1; i <= 16; i++) {
        if (i === frogPosition) {
            board += "🐸 ";
        } else {
            board += "⬛ ";
        }
        if (i % 4 === 0) {
            board += "\n";
        }
    }
    return board.trim();
                }
