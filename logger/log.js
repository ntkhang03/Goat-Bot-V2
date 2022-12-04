const chalk = require("chalk");
const moment = require("moment-timezone");
const characters = '';
const getCurrentTime = () => chalk.gray(moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY"));

function logError(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "ERROR";
	}
	console.log(`${getCurrentTime()} ${chalk.redBright(`${characters} ${prefix}:`)}`, message);
	const error = Object.values(arguments).slice(2);
	for (let err of error) {
		if (typeof err == "object" && !err.stack)
			err = JSON.stringify(err, null, 2);
		console.log(`${getCurrentTime()} ${chalk.redBright(`${characters} ${prefix}:`)}`, err);
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
		console.log(`${getCurrentTime()} ${chalk.yellowBright(`${characters} ${prefix}:`)}`, message);
	},
	info: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "INFO";
		}
		console.log(`${getCurrentTime()} ${chalk.greenBright(`${characters} ${prefix}:`)}`, message);
	},
	master: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "MASTER";
		}
		console.log(`${getCurrentTime()} ${chalk.hex("#eb6734")(`${characters} ${prefix}:`)}`, message);
	}
};