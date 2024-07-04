const moment = require('moment');

module.exports = {
  config: {
    name: "uptime",
    aliases: ['upt'],
    version: "1.0",
    author: "HeDroxuu",
    category: "system",
    guide: {
      en: "Use {p}uptime or {p}upt"
    }
  },
  onStart: async function ({ message }) {
    const uptime = process.uptime();
    const formattedUptime = formatMilliseconds(uptime * 1000);

    const response = `Running Smoothly Since: ${formattedUptime}.`;

    message.reply(response);
  }
};

function formatMilliseconds(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
}
