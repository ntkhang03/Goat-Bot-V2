const axios = require('axios');
const { config } = global.GoatBot;
const { log } = global.utils;
if (global.timeOutUptime != undefined)
	clearTimeout(global.timeOutUptime);
if (!config.autoUptime.enable)
	return;

const PORT = config.dashBoard?.port || (!isNaN(config.serverUptime.port) && config.serverUptime.port) || 3001;

let myUrl = config.autoUptime.url || `https://${process.env.REPL_OWNER
	? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
	: process.env.API_SERVER_EXTERNAL == "https://api.glitch.com"
		? `${process.env.PROJECT_DOMAIN}.glitch.me`
		: `localhost:${PORT}`}`;
myUrl.includes('localhost') && (myUrl = myUrl.replace('https', 'http'));
myUrl += '/uptime';

let status = 'ok';
setTimeout(async function autoUptime() {
	try {
		await axios.get(myUrl);
		if (status != 'ok') {
			status = 'ok';
			log.info("UPTIME", "Bot is online");
			// Custome notification here
		}
	}
	catch (e) {
		const err = e.response.data;
		if (status != 'ok')
			return;
		status = 'failed';

		if (err.statusAccountBot == "can't login") {
			log.err("UPTIME", "Can't login account bot");
			// Custome notification here
		}
		else if (err.statusAccountBot == "block spam") {
			log.err("UPTIME", "Your account is blocked");
			// Custome notification here
		}
	}
	global.timeOutUptime = setInterval(autoUptime, config.autoUptime.timeInterval);
}, config.autoUptime.timeInterval);
log.info("AUTO UPTIME", "Đã bật chế độ autoUptime");