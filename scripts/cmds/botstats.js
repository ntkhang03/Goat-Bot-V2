const axios = require('axios');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: 'botstats',
    author: 'Jun',
    countDown: 5,
    role: 2,
    category: 'tools',
    shortDescription: { en: "" }
  },

  onStart: async function({ event, api, message, args, usersData, threadsData }) {
    try {
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const uptime = process.uptime();

      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const uptimeString = `${hours}:${minutes}:${seconds}`;

      const currentDate = moment().tz('Asia/Manila').format('YYYY-MM-DD');
      const currentTime = moment().tz('Asia/Manila').format('HH:mm:ss');

    const output2 = `\nBOT STATS\n\nbot running: ${uptimeString}\ncurrent time: ${currentTime}\ncurrent date: ${currentDate}`;

      const response = await axios.get('https://api-test.yourboss12.repl.co/stats/hello');
      const data = response.data;

      const sortedData = data.sort((a, b) => b[Object.keys(b)[0]] - a[Object.keys(a)[0]]);

      let commandCount = 10;
      if (args[0] && args[0].toLowerCase() === 'all') {
        commandCount = data.length;
      }

      const topCommands = sortedData.slice(0, commandCount);

      let output = `${output2}\ntotal users: ${allUsers.length}\ntotal threads: ${allThreads.length}\n\n\nTop ${commandCount} most spammed commands from 2023-08-14 to ${currentDate}\n\n`;
      topCommands.forEach((command, index) => {
        const commandName = Object.keys(command)[0];
        const commandCount = command[commandName];
        output += `${index + 1}. ${commandName}: ${commandCount}\n`;
      });

      api.sendMessage(output, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
    }
}
};
