let games = {};

function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function isBoardFull(board) {
  return board.every((cell) => cell !== null);
}

function displayBoard(board) {
  let display = "";
  for (let i = 0; i < 9; i++) {
    display += board[i] ? board[i] : "⬛";
    display += (i + 1) % 3 === 0 ? "\n" : " ";
  }
  return display.replace(/❌/g, "❌").replace(/⭕/g, "⭕").replace(/X/g, "❌").replace(/O/g, "⭕");
}

function makeBotMove(board, currentPlayer) {
  const botPlayer = games[currentPlayer].botPlayer;
  const opponent = currentPlayer === "⭕" ? "❌" : "⭕";

  const oppositeCorner = {
    1: 9,
    3: 7,
    7: 3,
    9: 1
  };

  const corners = [1, 3, 7, 9];
  const sides = [2, 4, 6, 8];

  if (board.filter(cell => cell === "⭕" || cell === "❌").every(cell => cell === null)) {
    const cornersAndCenter = [1, 3, 5, 7, 9];
    const randomCorner = cornersAndCenter[Math.floor(Math.random() * cornersAndCenter.length)];
    board[randomCorner - 1] = botPlayer;
    return;
  }

  const winningMove = findWinningMove(board, botPlayer);
  if (winningMove !== null) {
    board[winningMove] = botPlayer;
    return;
  }

  const blockingMove = findBlockingMove(board, opponent);
  if (blockingMove !== null) {
    board[blockingMove] = botPlayer;
    return;
  }

  const lastMove = board.lastIndexOf(opponent);
  if (lastMove !== -1 && corners.includes(lastMove + 1)) {
    const opposite = oppositeCorner[lastMove + 1];
    if (board[opposite - 1] === null) {
      board[opposite - 1] = botPlayer;
      return;
    }
  }

  if (board[4] === null) {
    board[4] = botPlayer;
    return;
  }

  for (const corner of corners) {
    if (board[corner - 1] === null) {
      board[corner - 1] = botPlayer;
      return;
    }
  }

  for (const side of sides) {
    if (board[side - 1] === null) {
      board[side - 1] = botPlayer;
      return;
    }
  }
}

function findWinningMove(board, player) {
  for (let i = 0; i < 3; i++) {
    if (board[i * 3] === player && board[i * 3 + 1] === player && board[i * 3 + 2] === null) {
      return i * 3 + 2;
    }
    if (board[i * 3] === player && board[i * 3 + 1] === null && board[i * 3 + 2] === player) {
      return i * 3 + 1;
    }
    if (board[i * 3] === null && board[i * 3 + 1] === player && board[i * 3 + 2] === player) {
      return i * 3;
    }
  }

  for (let i = 0; i < 3; i++) {
    if (board[i] === player && board[i + 3] === player && board[i + 6] === null) {
      return i + 6;
    }
    if (board[i] === player && board[i + 3] === null && board[i + 6] === player) {
      return i + 3;
    }
    if (board[i] === null && board[i + 3] === player && board[i + 6] === player) {
      return i;
    }
  }

  if (board[0] === player && board[4] === player && board[8] === null) {
    return 8;
  }
  if (board[0] === player && board[4] === null && board[8] === player) {
    return 4;
  }
  if (board[0] === null && board[4] === player && board[8] === player) {
    return 0;
  }
  if (board[2] === player && board[4] === player && board[6] === null) {
    return 6;
  }
  if (board[2] === player && board[4] === null && board[6] === player) {
    return 4;
  }
  if (board[2] === null && board[4] === player && board[6] === player) {
    return 2;
  }

  return null;
}

function findBlockingMove(board, opponent) {
  return findWinningMove(board, opponent);
}

function resetGame(playerID) {
  games[playerID] = {
    board: Array(9).fill(null),
    currentPlayer: Math.random() < 0.5 ? "❌" : "⭕",
    inProgress: true,
    botPlayer: "❌"
  };
}

async function handleGameEnd(board, playerID, api, event) {
  if (!games[playerID]) {
    return;
  }

  const isGameOver = !isBoardFull(board) && !checkWinner(board);
  if (!isGameOver) {
    games[playerID].inProgress = false;
    const updatedBoardMessage = displayBoard(board);
    api.sendMessage(updatedBoardMessage, event.threadID);

    const playerInfo = await api.getUserInfo(playerID);
    const playerName = playerInfo[playerID].name;
    const winningPlayer = checkWinner(board);

    if (winningPlayer) {
      const winnerName = winningPlayer === "⭕" ? playerName : "Bot";
      api.sendMessage(`${winnerName} won the game!`, event.threadID, event.messageID);
    } else {
      api.sendMessage("It's a draw!", event.threadID, event.messageID);
    }
  }
}

module.exports = {
  config: {
    name: "ttt",
    aliases: ["tictactoe"],
    version: "2.0",
    author: "Vex_Kshitiz",
    category: "game",
  },
  onStart: async function ({ event, api }) {
    const playerID = event.senderID;
    const mention = Object.keys(event.mentions);

    if (mention.length === 0) {
      if (!games[playerID] || !games[playerID].inProgress || checkWinner(games[playerID].board)) {
        resetGame(playerID);
      }

      const boardMessage = displayBoard(games[playerID].board);
      api.sendMessage(boardMessage, event.threadID, event.messageID);
    } else {
      const player1ID = mention[0];
      const player2ID = playerID;
      const players = [player1ID, player2ID];

      const player1Info = await api.getUserInfo(player1ID);
      const player2Info = await api.getUserInfo(player2ID);

      const player1Name = player1Info[player1ID].name;
      const player2Name = player2Info[player2ID].name;

      global.tttGame = {
        players: players,
        currentPlayerIndex: Math.round(Math.random()),
        board: Array(9).fill(null),
        currentMessageID: null,
        player1Name: player1Name,
        player2Name: player2Name
      };

      const gameBoard = displayBoard(global.tttGame.board);
      const sentMessage = await api.sendMessage(`${gameBoard}`, event.threadID);
      global.tttGame.currentMessageID = sentMessage.messageID;

      const firstPlayerName = global.tttGame.players[global.tttGame.currentPlayerIndex] === player1ID ? player1Name : player2Name;
      api.sendMessage(`${firstPlayerName} make your move.`, event.threadID, event.messageID);

      global.tttGame.currentPlayerName = firstPlayerName;
      global.tttGame.opponentName = global.tttGame.players[1 - global.tttGame.currentPlayerIndex] === player1ID ? player1Name : player2Name;
    }
  },

  onChat: async function ({ event, api, args }) {
    const playerID = event.senderID;

    if (!games[playerID] || !games[playerID].inProgress) {
      if (!global.tttGame) return;

      const playerIndex = global.tttGame.currentPlayerIndex;
      const currentPlayer = global.tttGame.players[playerIndex];
      const opponentIndex = (playerIndex + 1) % 2;

      if (event.senderID !== currentPlayer) return;

      const position = parseInt(args[0]);

      if (isNaN(position) || position < 1 || position > 9 || global.tttGame.board[position - 1] !== null) {
        return;
      }

      global.tttGame.board[position - 1] = currentPlayer === global.tttGame.players[0] ? "⭕" : "❌";

      const updatedBoardMessage = displayBoard(global.tttGame.board);
      const sentMessage = await api.sendMessage(updatedBoardMessage, event.threadID);

      try {
        api.unsendMessage(global.tttGame.currentMessageID);
      } catch (error) {
        console.error("Error while unsending message:", error);
      }
      if (checkWinner(global.tttGame.board)) {
        const winningPlayer = checkWinner(global.tttGame.board);
        let winnerName = "";
        if (winningPlayer === "⭕") {
          winnerName = global.tttGame.player1Name;
        } else if (winningPlayer === "❌") {
          winnerName = global.tttGame.player2Name;
        }
        await api.sendMessage(`${winnerName} wins!`, event.threadID);
        delete global.tttGame;
        return;
      }
      if (isBoardFull(global.tttGame.board)) {
        await api.sendMessage("It's a draw!", event.threadID);
        delete global.tttGame;
        return;
      }

      global.tttGame.currentPlayerIndex = opponentIndex;
      return;
    }

    const position = parseInt(args[0]);

    if (isBoardFull(games[playerID].board) || checkWinner(games[playerID].board)) {
      await handleGameEnd(games[playerID].board, playerID, api, event);
      return;
    }

    if (!isNaN(position) && position >= 1 && position <= 9 && games[playerID].board[position - 1] === null) {
      games[playerID].board[position - 1] = "⭕";

      makeBotMove(games[playerID].board, playerID);

      const updatedBoardMessage = displayBoard(games[playerID].board);
      api.sendMessage(updatedBoardMessage, event.threadID, event.messageID);

      await handleGameEnd(games[playerID].board, playerID, api, event);
    }
  },
};
