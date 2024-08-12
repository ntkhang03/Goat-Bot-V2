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

    const response = `╭╼╾『𝐒𝐲𝐬𝐭𝐞𝐦 𝐔𝐩𝐭𝐢𝐦𝐞』\n${formattedUptime}`;

    message.reply(response);
  }
};

function formatMilliseconds(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return `╰─> 𝐃𝐚𝐲𝐬 ─ ${days}\n╰─> 𝐇𝐫𝐬 ─ ${hours % 24}\n╰─> 𝐌𝐢𝐧𝐬 ─ ${minutes % 60}\n╰─> 𝐒𝐞𝐜 ─ ${seconds % 60}`;
}
