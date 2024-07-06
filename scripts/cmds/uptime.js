.cmd install uptime.js const moment = require('moment');

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

    const response = `╭╼╾『𝐎𝐩𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐓𝐢𝐦𝐞』\n╰─> ${formattedUptime}`;

    message.reply(response);
  }
};

function formatMilliseconds(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return `${days}𝐃𝐚𝐲𝐬, ${hours % 24}𝐇𝐫𝐬, ${minutes % 60}𝐌𝐢𝐧𝐬, and ${seconds % 60}𝐒𝐞𝐜`;
}
