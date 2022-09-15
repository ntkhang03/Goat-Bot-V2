const chalk = require("chalk");
module.exports = (color, message) => console.log(chalk.hex(color)(message));