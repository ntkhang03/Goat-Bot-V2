const TIMEOUT_SECONDS = 120; // Game timeout duration in seconds, change as per need

// Initialize a Map to track ongoing fights by threadID
const ongoingFights = new Map();
// Initialize a Map to store game instances for each pair
const gameInstances = new Map();

module.exports = {
  config: {
    name: "fight",
    version: "1.0",
    author: "Shikaki",
    countDown: 10,
    role: 0,
    shortDescription: {
      vi: "",
      en: "Fight with your friends!",
    },
    longDescription: {
      vi: "",
      en: "Challenge your friends to a fight and see who wins!",
    },
    category: "🎮 Game",
    guide: "{prefix}fight @mention",
  },

  onStart: async function ({ event, message, api, usersData, args }) {
    const threadID = event.threadID;

    // Check if there's already an ongoing fight in this thread
    if (ongoingFights.has(threadID)) {
      return message.send("⚔️ A fight is already in progress in this group.");
    }

    const mention = Object.keys(event.mentions);

    if (mention.length !== 1) {
      return message.send("🤔 Please mention one person to start a fight with.");
    }

    const challengerID = event.senderID;
    const opponentID = mention[0];

    const challenger = await usersData.getName(challengerID);
    const opponent = await usersData.getName(opponentID);

    // Create a new fight instance for this pair
    const fight = {
      participants: [],
      currentPlayer: null,
      threadID: threadID,
      startTime: null, // Store the start time
    };

    fight.participants.push({
      id: challengerID,
      name: challenger,
      hp: 100, // Starting HP
    });
    fight.participants.push({
      id: opponentID,
      name: opponent,
      hp: 100, // Starting HP
    });

    // Create a new game instance for this pair
    const gameInstance = {
      fight: fight,
      lastAttack: null,
      lastPlayer: null,
      timeoutID: null, // Store the timeout ID
      turnMessageSent: false, // Keep track of whether the turn message was sent
    };

    // Randomly determine the starting player within the pair
    gameInstance.fight.currentPlayer = Math.random() < 0.5 ? challengerID : opponentID;

    // Add the game instance to the Map
    gameInstances.set(threadID, gameInstance);

    // Start the fight for this pair
    startFight(message, fight);

    // Start the timeout for this game
    startTimeout(threadID, message);
  },

  // Modify the onChat function as follows:
  onChat: async function ({ event, message }) {
    const threadID = event.threadID;

    // Find the ongoing fight for this thread
    const gameInstance = gameInstances.get(threadID);

    if (!gameInstance) return;

    const currentPlayerID = gameInstance.fight.currentPlayer;
    const currentPlayer = gameInstance.fight.participants.find(
      (p) => p.id === currentPlayerID
    );

    const attack = event.body.trim().toLowerCase();

    // Check if the message sender is one of the current players
    const isCurrentPlayer = event.senderID === currentPlayerID;

    // Check if the opponent has attacked already
    if (gameInstance.lastAttack !== null && !isCurrentPlayer) {
      // Inform the current player that it's their opponent's turn
      message.reply(`😒 It's ${currentPlayer.name}'s turn currently. You can't attack until they make a move.`);
      return;
    }

    // Check if the opponent is trying to attack when it's not their turn
    if (!isCurrentPlayer && gameInstance.lastPlayer.id === event.senderID) {
      message.send(`👎 It's ${currentPlayer.name}'s turn currently. You can't attack until they make a move.`);
      return;
    }

    // Check if the message sender is NOT one of the current players
    if (!isCurrentPlayer) {
      // If it's not the current player's turn, prepare the message for the opponent
      if (!gameInstance.turnMessageSent) {
        // Prepare the message, but don't send it yet
        const opponentName = gameInstance.fight.participants.find(p => p.id !== event.senderID).name;
        const turnMessage = `It's ${currentPlayer.name}'s turn.`;
        message.prepare(turnMessage, event.senderID);

        // Remember that the turn message has been sent
        gameInstance.turnMessageSent = true;
      }
      return;
    }

    // Check if the opponent dodged the attack
    if (attack === "forfeit") {
      const forfeiter = currentPlayer.name;
      const opponent = gameInstance.fight.participants.find(
        (p) => p.id !== currentPlayerID
      ).name;
      message.send(`🏃 ${forfeiter} forfeits the match! ${opponent} wins!`);
      endFight(threadID);
    } else if (["kick", "punch", "slap"].includes(attack)) {
      // Calculate damage (with 10% chance to miss)
      const damage = Math.random() < 0.1 ? 0 : Math.floor(Math.random() * 20 + 10);

      // Apply damage to the opponent
      const opponent = gameInstance.fight.participants.find((p) => p.id !== currentPlayerID);
      opponent.hp -= damage;

      // Display damage dealt message
      message.send(
        `🥊 ${currentPlayer.name} attacks ${opponent.name} with ${attack} and deals ${damage} damage.\n\nNow, ${opponent.name} has ${opponent.hp} HP, and ${currentPlayer.name} has ${currentPlayer.hp} HP.`
      );

      // Check if the game is over
      if (opponent.hp <= 0) {
        const winner = currentPlayer.name;
        const loser = opponent.name;
        message.send(`⏰ Time's up! The game is over. ${winner} wins! ${loser} is defeated.`);
        endFight(threadID);
      } else {
        // Switch turns within the pair
        gameInstance.fight.currentPlayer =
          currentPlayerID === gameInstance.fight.participants[0].id
            ? gameInstance.fight.participants[1].id
            : gameInstance.fight.participants[0].id;
        const newCurrentPlayer = gameInstance.fight.participants.find(p => p.id === gameInstance.fight.currentPlayer);

        // Update last attack and player
        gameInstance.lastAttack = attack;
        gameInstance.lastPlayer = currentPlayer;

        // Reset the turn message status
        gameInstance.turnMessageSent = false;

        // Display whose turn it is now
        message.send(`🥲 It's ${newCurrentPlayer.name}'s turn currently.`);
      }
    } else {
      message.reply(
        "❌ Invalid attack! Use 'kick', 'punch', 'slap', or 'forfeit'."
      );
    }
  },

};

// Function to start a fight
function startFight(message, fight) {
  ongoingFights.set(fight.threadID, fight);

  const currentPlayer = fight.participants.find(p => p.id === fight.currentPlayer);
  const opponent = fight.participants.find(p => p.id !== fight.currentPlayer);

  // List of available attacks
  const attackList = ["kick", "punch", "slap", "forfeit"];

  message.send(
    `${currentPlayer.name} has challenged ${opponent.name} to a duel!\n\n${currentPlayer.name} has ${currentPlayer.hp} HP, and ${opponent.name} has ${opponent.hp} HP.\n\nIt's ${currentPlayer.name}'s turn currently.\n\nAvailable attacks: ${attackList.join(', ')}`
  );
}

// Function to start a timeout for a game
function startTimeout(threadID, message) {
  const timeoutID = setTimeout(() => {
    const gameInstance = gameInstances.get(threadID);
    if (gameInstance) {
      const currentPlayer = gameInstance.fight.participants.find(
        (p) => p.id === gameInstance.fight.currentPlayer
      );
      const opponent = gameInstance.fight.participants.find(
        (p) => p.id !== gameInstance.fight.currentPlayer
      );
      const winner = currentPlayer.hp > opponent.hp ? currentPlayer : opponent;
      const loser = currentPlayer.hp > opponent.hp ? opponent : currentPlayer;

      message.send(
        `Time's up! The game is over. ${winner.name} has more HP, so ${winner.name} wins! ${loser.name} is defeated.`
      );

      // End the fight
      endFight(threadID);
    }
  }, TIMEOUT_SECONDS * 1000); // Convert seconds to milliseconds

  // Store the timeout ID in the game instance
  gameInstances.get(threadID).timeoutID = timeoutID;
}

// Function to end a fight and clean up
function endFight(threadID) {
  ongoingFights.delete(threadID);
  // Clear the timeout for this game
  const gameInstance = gameInstances.get(threadID);
  if (gameInstance && gameInstance.timeoutID) {
    clearTimeout(gameInstance.timeoutID);
  }
  // Remove the game instance for this thread
  gameInstances.delete(threadID);
}