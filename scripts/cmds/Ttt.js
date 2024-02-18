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
  return display.replace(/❌/g, "❌").replace(/⭕/g, "⭕");
}

function makeBotMove(board, currentPlayer) {
  const opponent = currentPlayer === "❌" ? "⭕" : "❌";

  
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = currentPlayer;
      if (checkWinner(board) === currentPlayer) {
        return;
      }
      board[i] = null;
    }
  }

  
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = opponent;
      if (checkWinner(board) === opponent) {
        board[i] = currentPlayer;
        return;
      }
      board[i] = null;
    }
  }

  
  const forkMoves = findForkMoves(board, currentPlayer);
  if (forkMoves.length > 0) {
    board[forkMoves[0]] = currentPlayer;
    return;
  }

 
  const opponentForkMoves = findForkMoves(board, opponent);
  if (opponentForkMoves.length > 0) {
  
    board[opponentForkMoves[0]] = currentPlayer;
    return;
  }

 
  if (board[4] === null) {
    board[4] = currentPlayer;
    return;
  }

 
  const oppositeCornerMove = findOppositeCornerMove(board, opponent);
  if (oppositeCornerMove !== null && board[oppositeCornerMove] === null) {
    board[oppositeCornerMove] = currentPlayer;
    return;
  }

  
  const cornerMove = findEmptyCorner(board);
  if (cornerMove !== null) {
    board[cornerMove] = currentPlayer;
    return;
  }

  
  const sideMove = findEmptySide(board);
  if (sideMove !== null) {
    board[sideMove] = currentPlayer;
    return;
  }
}

function findForkMoves(board, currentPlayer) {
  const forkMoves = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = currentPlayer;
      const opponentWinCount = countPossibleWins(board, currentPlayer === "❌" ? "⭕" : "❌");
      if (opponentWinCount >= 2) {
        forkMoves.push(i);
      }
      board[i] = null;
    }
  }
  return forkMoves;
}

function countPossibleWins(board, player) {
  let winCount = 0;
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] === player && board[b] === player && board[c] === null) {
      winCount++;
    }
    if (board[a] === player && board[b] === null && board[c] === player) {
      winCount++;
    }
    if (board[a] === null && board[b] === player && board[c] === player) {
      winCount++;
    }
  }

  return winCount;
}

function findOppositeCornerMove(board, corner) {
  const oppositeCorners = [
    [0, 8], [2, 6], [6, 2], [8, 0]
  ];

  for (const [corner1, corner2] of oppositeCorners) {
    if (board[corner1] === corner && board[corner2] === null) {
      return corner2;
    } else if (board[corner2] === corner && board[corner1] === null) {
      return corner1;
    }
  }

  return null;
}

function findEmptyCorner(board) {
  const corners = [0, 2, 6, 8];

  for (const corner of corners) {
    if (board[corner] === null) {
      return corner;
    }
  }

  return null;
}

function findEmptySide(board) {
  const sides = [1, 3, 5, 7];

  for (const side of sides) {
    if (board[side] === null) {
      return side;
    }
  }

  return null;
}

function resetGame(playerID) {
  games[playerID] = {
    board: Array(9).fill(null),
    currentPlayer: "⭕",
    inProgress: true,
  };
}

module.exports = {
  config: {
    name: "ttt",
    aliases: ["tictactoe"],
    version: "1.0",
    author: "Kshitiz",
    category: "game",
  },
  onStart: async function ({ event, api }) {
    const playerID = event.senderID;

    if (!games[playerID] || !games[playerID].inProgress || checkWinner(games[playerID].board)) {
      resetGame(playerID);
    }

    const introMessage = "Reply box by number\nYou are '❌' and the bot is '⭕'.";
    api.sendMessage(introMessage, event.threadID, event.messageID);

    const boardMessage = displayBoard(games[playerID].board);
    api.sendMessage(boardMessage, event.threadID, event.messageID);
  },

  onChat: async function ({ event, api, args }) {
    const playerID = event.senderID;

    if (!games[playerID] || !games[playerID].inProgress) {
      return;
    }

    const position = parseInt(args[0]);

    if (isBoardFull(games[playerID].board) || checkWinner(games[playerID].board)) {
      games[playerID].inProgress = false;
      api.sendMessage("Game finished. Type 'ttt' to start a new game!", event.threadID, event.messageID);
      return;
    }

    if (!isNaN(position) && position >= 1 && position <= 9 && games[playerID].board[position - 1] === null) {
      games[playerID].board[position - 1] = "❌";

      makeBotMove(games[playerID].board, games[playerID].currentPlayer);

      const updatedBoardMessage = displayBoard(games[playerID].board);
      api.sendMessage(updatedBoardMessage, event.threadID, event.messageID);

      const winner = checkWinner(games[playerID].board);
      if (winner) {
        api.sendMessage(`${winner} wins!`, event.threadID, event.messageID);
        games[playerID].inProgress = false;
      } else if (isBoardFull(games[playerID].board)) {
        api.sendMessage("It's a draw!", event.threadID, event.messageID);
        games[playerID].inProgress = false;
      }
    }
  },
};
