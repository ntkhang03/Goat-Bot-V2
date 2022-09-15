const chalk = require("chalk");
const moment = require("moment-timezone");
const characters = '⇒ ';
const getCurrentTime = () => chalk.gray(moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY"));

function logError(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "ERROR";
	}
	console.log(chalk`{redBright [} ${getCurrentTime()} {redBright ]} ${chalk.redBright(`${characters} ${prefix}:`)}`, message);
	const error = Object.values(arguments).slice(2);
	for (let err of error) {
		if (typeof err == "object" && !err.stack)
			err = JSON.stringify(err, null, 2);
		console.log(chalk`{redBright [} ${getCurrentTime()} {redBright ]} ${chalk.redBright(`${characters} ${prefix}:`)}`, err);
	}
}

module.exports = {
	err: logError,
	error: logError,
	warn: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "WARN";
		}
		console.log(chalk`{yellowBright [} ${getCurrentTime()} {yellowBright ]} ${chalk.yellowBright(`${characters} ${prefix}:`)}`, message);
	},
	info: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "INFO";
		}
		console.log(chalk`{greenBright [} ${getCurrentTime()} {greenBright ]} ${chalk.greenBright(`${characters} ${prefix}:`)}`, message);
	},
	master: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "MASTER";
		}
		console.log(chalk`{magentaBright [} ${getCurrentTime()} {magentaBright ]} ${chalk.magentaBright(`${characters} ${prefix}:`)}`, message);
	}
};