
const isHexColor = color => color?.match?.(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
const colorFunctions = {
	bold: text => `\x1b[1m${text}\x1b[0m`,
	italic: text => `\x1b[3m${text}\x1b[0m`,
	underline: text => `\x1b[4m${text}\x1b[0m`,
	strikethrough: text => `\x1b[9m${text}\x1b[0m`,
	blink: text => `\x1b[5m${text}\x1b[0m`,
	inverse: text => `\x1b[7m${text}\x1b[0m`,
	hidden: text => `\x1b[8m${text}\x1b[0m`,

	black: text => `\x1b[30m${text}\x1b[0m`,
	blue: text => `\x1b[34m${text}\x1b[0m`,
	blueBright: text => `\x1b[94m${text}\x1b[0m`,
	cyan: text => `\x1b[36m${text}\x1b[0m`,
	cyanBright: text => `\x1b[96m${text}\x1b[0m`,
	default: text => text,
	gray: text => `\x1b[90m${text}\x1b[0m`,
	green: text => `\x1b[32m${text}\x1b[0m`,
	greenBright: text => `\x1b[92m${text}\x1b[0m`,
	grey: text => `\x1b[90m${text}\x1b[0m`,
	magenta: text => `\x1b[35m${text}\x1b[0m`,
	red: text => `\x1b[31m${text}\x1b[0m`,
	redBright: text => `\x1b[91m${text}\x1b[0m`,
	reset: text => text,
	white: text => `\x1b[37m${text}\x1b[0m`,
	yellow: text => `\x1b[33m${text}\x1b[0m`,
	yellowBright: text => `\x1b[93m${text}\x1b[0m`,
	hex: function (color, text) {
		if (isHexColor(text))
			[color, text] = [text, color];

		if (text) {
			return `\x1b[38;2;${parseInt(color.slice(1, 3), 16)};${parseInt(color.slice(3, 5), 16)};${parseInt(color.slice(5, 7), 16)}m${text}\x1b[0m`;
		}
		else {
			if (!isHexColor(color))
				return function (color_) {
					return `\x1b[38;2;${parseInt(color_.slice(1, 3), 16)};${parseInt(color_.slice(3, 5), 16)};${parseInt(color_.slice(5, 7), 16)}m${color}\x1b[0m`;
				};
			else
				return function (text) {
					return `\x1b[38;2;${parseInt(color.slice(1, 3), 16)};${parseInt(color.slice(3, 5), 16)};${parseInt(color.slice(5, 7), 16)}m${text}\x1b[0m`;
				};
		}
	},

	bgBlack: text => `\x1b[40m${text}\x1b[0m`,
	bgBlue: text => `\x1b[44m${text}\x1b[0m`,
	bgCyan: text => `\x1b[46m${text}\x1b[0m`,
	bgGray: text => `\x1b[100m${text}\x1b[0m`,
	bgGreen: text => `\x1b[42m${text}\x1b[0m`,
	bgGrey: text => `\x1b[100m${text}\x1b[0m`,
	bgMagenta: text => `\x1b[45m${text}\x1b[0m`,
	bgRed: text => `\x1b[41m${text}\x1b[0m`,
	bgWhite: text => `\x1b[47m${text}\x1b[0m`,
	bgYellow: text => `\x1b[43m${text}\x1b[0m`,
	bgHex: function (color, text) {
		if (isHexColor(text))
			[color, text] = [text, color];

		if (text) {
			return `\x1b[48;2;${parseInt(color.slice(1, 3), 16)};${parseInt(color.slice(3, 5), 16)};${parseInt(color.slice(5, 7), 16)}m${text}\x1b[0m`;
		}
		else {
			if (!isHexColor(color))
				return color_ => `\x1b[48;2;${parseInt(color_.slice(1, 3), 16)};${parseInt(color_.slice(3, 5), 16)};${parseInt(color_.slice(5, 7), 16)}m${color}\x1b[0m`;
			else
				return text => `\x1b[48;2;${parseInt(color.slice(1, 3), 16)};${parseInt(color.slice(3, 5), 16)};${parseInt(color.slice(5, 7), 16)}m${text}\x1b[0m`;
		}
	}
};


const colors = {};
colors.bold = {};

for (const key in colorFunctions) {
	if (key === 'bold')
		continue;
	colors[key] = colorFunctions[key];
	colors[key].bold = (text, color) => colorFunctions.bold(colorFunctions[key](text, color));
	colors.bold[key] = (text, color) => colorFunctions.bold(colorFunctions[key](text, color));
}

module.exports = {
	isHexColor,
	colors
};