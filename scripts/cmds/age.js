module.exports = {

	config: {		name: "age",

		version: "1.0",

		author: "⏤͟͞𝙄𝙡𝙡𝙪𝙨𝙞𝙤𝙣 𝙂𝙝𝙤𝙨𝙩",

		countDown: 5,

		role: 0,

		shortDescription: {

			vi: "Age calculator",

			en: "Age calculator"

		},

		longDescription: {

			vi: "Age calculator",

			en: "Age calculator"

		},

		category: "box chat",

		guide: {

			vi: "{pn} [dd/mm/yyyy] (01/07/2000)",

			en: "{pn} [dd/mm/yyyy] (01/07/2000)"

		}

	},

	onStart: async function ({ message, event, args, api }) {

		const birthdate = args.join(" ");

		const separator = birthdate.indexOf('-') !== -1 ? '-' : '/';

		const dateComponents = birthdate.split(separator).map(Number);

		if (dateComponents.length !== 3) {

		  message.reply('❎ | Please provide a valid birthdate in the format of DD-MM-YYYY or DD/MM/YYYY');

		  return;

		};

		const [birthDay, birthMonth, birthYear] = dateComponents;

		if (!isValidDate(birthDay, birthMonth, birthYear)) {

		  message.reply('❎ | Please provide a valid birthdate');

		  return;

		};

		const currentDate = new Date();

		const currentYear = currentDate.getFullYear();

		const currentMonth = currentDate.getMonth() + 1;

		const currentDay = currentDate.getDate();

		let ageYear = currentYear - birthYear;

		let ageMonth = currentMonth - birthMonth;

		let ageDay = currentDay - birthDay;

		if (ageDay < 0) {

		  ageMonth--;

		  ageDay += daysInMonth(birthMonth, birthYear);

		};

		if (ageMonth < 0) {

		  ageYear--;

		  ageMonth += 12;

		};

		return message.reply(`✅ | You are ${ageYear} years, ${ageMonth} months, and ${ageDay} days old.`);

		function daysInMonth(month, year) {

		  return new Date(year, month, 0).getDate();

		};

		function isValidDate(day, month, year) {

		  const date = new Date(year, month - 1, day);

		  return (

		    month === date.getMonth() + 1 && day === date.getDate() && year === date.getFullYear()

		    );

		};

	}

};
