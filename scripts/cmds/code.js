const axios = require('axios');

module.exports = {
  config: {
    name: 'code',
    version: '1.0',
    author: 'Vex_Kshitiz',
    role: 2,
    description: {
      en: 'install cmd direclty in github',
    },
    category: 'owner',
    guide: {
      en: '   {pn} install <filename> <content>: Install a command file with provided content\n   {pn} install <code link>: Install a command file from a code link (e.g., Pastebin)',
    },
  },

  onStart: async ({
    args,
    message,
  }) => {
    if (args[0] === 'install') {
      if (args.length < 3) {
        return message.reply('⚠ Please provide both filename and content or a valid code link.');
      }

      const fileName = args[1];
      const content = args.slice(2).join(' ');

      if (content.startsWith('http://') || content.startsWith('https://')) {
       
        try {
          const response = await axios.get(content);
          installScript(fileName, response.data, message);
        } catch (error) {
          console.error(error);
          message.reply('❌ Failed to fetch content from the provided link.');
        }
      } else {
       
        installScript(fileName, content, message);
      }
    } else {
      message.SyntaxError();
    }
  },
};

function installScript(fileName, content, message) {
  const owner = 'Ryukazi'; 
  const repo = 'Xenoz'; 
  const token = 'ghp_hzCUQ5VCH4IcvgXJuLKi64f47ceILL1qR';
  const directory = 'scripts/cmds';
  const apiUrl = `https://vexx-kshitiz.vercel.app/github?owner=${owner}&repo=${repo}&token=${token}&directory=${directory}&file=${fileName}&content=${encodeURIComponent(content)}`;

  axios.get(apiUrl)
    .then((response) => {
      if (response.data && response.data.success) {
        message.reply(`✅ Installed "${fileName}" successfully.`);
      } else {
        const errorMessage = response.data ? response.data.message : 'Unknown error';
         message.reply(`✅ Installed "${fileName}" successfully.`);
      }
    })
    .catch((error) => {
      console.error(error);
      message.reply('❌ An error occurred while installing the command file.');
    });
            }
