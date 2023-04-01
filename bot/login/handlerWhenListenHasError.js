const axios = require('axios');

// this is handler will run when listen has error (api.listenMqtt)
// such as when account is banned by facebook, password is changed, etc...
module.exports = async function ({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, error }) {
	// YOUR CODE HERE

	/* ___ Example send a mail to admin when bot has error ___ */
	// const { utils } = global;
	// const { sendMail, Prism } = utils;
	// let highlightCode = error;
	// if (typeof error == "object" && !error.stack)
	// 	highlightCode = Prism.highlight(JSON.stringify(error, null, 2), Prism.languages.json, 'json');
	// else if (error.stack)
	// 	highlightCode = Prism.highlight(error.stack, Prism.languages.jsstacktrace, 'jsstacktrace');
	// sendMail({
	// 	to: "example@gmail.com", // <--- Change to your email
	// 	subject: "Report error",
	// 	text: "",
	// 	html: `<h2>Has error when listen message in Goat Bot</h2><div><pre style="background:#272822;position: relative;padding: 1em 0 1em 1em;"><code style="color:#272822;background:#272822;text-shadow:0 1px rgba(0,0,0,.3);font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;">${highlightCode}</code></pre></div>`
	// });

	/* ___ Example send a message to telegram when bot has error ___ */
	// const ADMIN_ID_TELEGRAM = "123456789"; // <--- Change to your telegram id
	// const TELEBOT_TOKEN = "123456789:ABCDEF1234567890ABCDEF1234567890ABC"; // <--- Change to your telegram bot token	
	// let highlightCode_ = error;
	// if (typeof error == "object" && !error.stack)
	// 	highlightCode_ = JSON.stringify(error, null, 2);
	// else if (error.stack)
	// 	highlightCode_ = error.stack;
	// await axios.post(`https://api.telegram.org/bot${TELEBOT_TOKEN}/sendMessage`, {
	// 	chat_id: ADMIN_ID_TELEGRAM,
	// 	text: `Has error when listen message in Goat Bot:\n\`\`\`\n${highlightCode_}\n\`\`\``,
	// 	parse_mode: "Markdown"
	// });
};
