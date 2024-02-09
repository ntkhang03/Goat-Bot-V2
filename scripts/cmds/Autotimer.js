const fs = require('fs');

module.exports = {
  config: {
    name: "autotimer",
    aliases: [],
    author: "kshitiz",
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "Toggle automatic random messages."
    },
    longDescription: {
      en: "auto send message"
    },
    category: "send random auto message",
    guide: {
      en: "{p}autotimer on / off"
    }
  },
  onStart: async function ({ api, event, args }) {
    try {
      const command = args[0];

      if (command === "on") {
        const lastActivationTime = loadLastActivationTime();

     
        if (!lastActivationTime || Date.now() - lastActivationTime > 1 * 60 * 60 * 1000) {
          api.sendMessage("", event.threadID);
          saveLastActivationTime();
          startSendingRotatingRandomMessages(api, event);
        } else {
          const remainingTime = 1 * 60 * 60 * 1000 - (Date.now() - lastActivationTime);
          api.sendMessage(`Automatic messages are already enabled.\nNext message will be sent in ${(remainingTime / (60 * 1000)).toFixed(2)} minutes.`, event.threadID);
        }
      } else if (command === "off") {
        
        api.sendMessage("Automatic  messages are now disabled.", event.threadID);
        stopSendingRotatingRandomMessages();
      } else {
        api.sendMessage("Invalid command. Type '{p}autotimer on' to start, and '{p}autotimer off' to stop.", event.threadID);
      }
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('An error occurred while processing the command.', event.threadID);
    }
  },
};

let randomMessagesEnabled = false;
let messageIntervalId;
const messagesSets = [
  ["We cannot solve problems with the kind of thinking we employed when we came up with them.", "Learn as if you will live forever, live like you will die tomorrow."],
    ["Have a great day!", "Nice to see you!"],
    ["Stay away from those people who try to disparage your ambitions.\nSmall minds will always do that,\nbut great minds will give\nyou a feeling that you can become great too.", "When you give joy to other people, you get more joy in return."],
    ["You should give a good thought to happiness that you can give out.", "When you change your thoughts, remember to also change your world."],
    ["Success is not final; failure is not fatal: It is the courage to continue that counts.", "It is better to fail in originality than to succeed in imitation."],
    ["The road to success and the road to failure are almost exactly the same.", "Success usually comes to those who are too busy looking for it."],
    ["Develop success from failures. Discouragement and failure are two of the surest stepping stones to success.", "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty."],
    ["Don’t let yesterday take up too much of today.", "You learn more from failure than from success. Don’t let it stop you. Failure builds character."],
    ["f you are working on something that you really care about, you don’t have to be pushed. The vision pulls you.", "Experience is a hard teacher because she gives the test first, the lesson afterwards."],
    ["To know how much there is to know is the beginning of learning to live.", "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus."],
    ["Either you run the day or the day runs you.", "When we strive to become better than we are, everything around us becomes better too."],
    ["Opportunity is missed by most people because it is dressed in overalls and looks like work.", "Setting goals is the first step in turning the invisible into the visible."],
    ["Try not to become a man of success, but rather become a man of value", "You've got to get up every morning with determination if you're going to go to bed with satisfaction."],
    ["The most difficult thing is the decision to act, the rest is merely tenacity", "Take the attitude of a student, never be too big to ask questions, never know too much to learn something new."],
    ["Just one small positive thought in the morning can change your whole day", "Opportunities don't happen, you create them."],
    ["Love your family, work super hard, live your passion.", "It is never too late to be what you might have been."],
    ["Don't let someone else's opinion of you become your reality", "If you’re not positive energy, you’re negative energy."],
    ["I am not a product of my circumstances. I am a product of my decisions.", "Do the best you can. No one can do more than that"],
    ["If you can dream it, you can do it.", "Do what you can, with what you have, where you are."],
    ["The greatest discovery of my generation is that a human being can alter his life by altering his attitudes", "I’d rather regret the things I’ve done than regret the things I haven’t done."],
    ["You can get everything in life you want if you will just help enough other people get what they want.", "Inspiration does exist, but it must find you working."],
    ["Show up, show up, show up, and after a while the muse shows up, too.", "Don't bunt. Aim out of the ballpark. Aim for the company of immortals."],
    ["If you believe something needs to exist, if it's something you want to use yourself, don't let anyone ever stop you from doing it", "Don't look at your feet to see if you are doing it right. Just dance"],
    ["True freedom is impossible without a mind made free by discipline.", "Rivers know this: there is no hurry. We shall get there some day."],
    ["Small is not just a stepping-stone. Small is a great destination itself", "He that can have patience can have what he will."],
  
];
let currentMessagesSetIndex = 0;

function startSendingRotatingRandomMessages(api, event) {
 
  sendRotatingRandomMessage(api, event);

 
  messageIntervalId = setInterval(() => {
    sendRotatingRandomMessage(api, event);
  }, 1 * 60 * 60 * 1000); 
}

function sendRotatingRandomMessage(api, event) {
 
  const randomMessage = generateRotatingRandomMessage();
  api.sendMessage(randomMessage, event.threadID);
}

function generateRotatingRandomMessage() {
 
  const currentMessagesSet = messagesSets[currentMessagesSetIndex];

 
  const randomIndex = Math.floor(Math.random() * currentMessagesSet.length);
  const randomMessage = currentMessagesSet[randomIndex];

 
  currentMessagesSetIndex = (currentMessagesSetIndex + 1) % messagesSets.length;

  return randomMessage;
}

function stopSendingRotatingRandomMessages() {
 
  randomMessagesEnabled = false;
  clearInterval(messageIntervalId);
}

function saveLastActivationTime() {
  fs.writeFileSync('lastActivationTime.txt', Date.now().toString());
}

function loadLastActivationTime() {
  try {
    const data = fs.readFileSync('lastActivationTime.txt', 'utf8');
    return parseInt(data);
  } catch (err) {
    return null;
  }
}
