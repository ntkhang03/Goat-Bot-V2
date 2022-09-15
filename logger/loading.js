const chalk = require("chalk");
const moment = require("moment-timezone");
const characters = '⇒ ';
const getCurrentTime = () => chalk.gray(moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss DD/MM/YYYY'));

function logError(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "ERROR";
	}
	process.stderr.write(`\r${chalk`{redBright [} ${getCurrentTime()} {redBright ]} ${chalk.redBright(`${characters} ${prefix}:`)} ${message}`}`);
}

module.exports = {
	err: logError,
	error: logError,
	warn: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "WARN";
		}
		process.stderr.write(`\r${chalk`{yellowBright [} ${getCurrentTime()} {yellowBright ]} ${chalk.yellowBright(`${characters} ${prefix}:`)} ${message}`}`);
	},
	info: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "INFO";
		}
		process.stderr.write(`\r${chalk`{greenBright [} ${getCurrentTime()} {greenBright ]} ${chalk.greenBright(`${characters} ${prefix}:`)} ${message}`}`);
	},
	master: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "MASTER";
		}
		process.stderr.write(`\r${chalk`{magentaBright [} ${getCurrentTime()} {magentaBright ]} ${chalk.magentaBright(`${characters} ${prefix}:`)} ${message}`}`);
	}
};