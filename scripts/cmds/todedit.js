const fs = require('fs');
const allowedUsers = [   
    "100088275903520",
    "100082741664058"];

module.exports = {
	config: {
		name: "td",
    aliases: ["tod"],
		version: "1.0",
		author: "Loid Butter",
		countDown: 5,
		role: 2,
		category: "categoryName",
		guide: "This command is used to edit the JSON files for truth and dare questions."
	},

	onStart: async function ({ args, message, event }) {

    const senderId = event.senderID;
		if (!allowedUsers.includes(senderId)) {
			message.reply("You are not authorized to Modify Truth or Dare Database...☠️");
			return;
    }
		if (args.length <2) {
			message.reply(`follow this:\nTo Add\n$td truth 'qn'\n$td dare 'dareChallenge'\n\nTo Remove\n$td truth-r 'qn'\n$td dare-r 'dareChallenge'`);
			return;
		}

		const type = args[0].toLowerCase();
		const value = args.slice(1).join(' ');

		if (type === "truth") {
			editJsonFile(`${__dirname}/assist_json/TRUTHQN.json`, value);
			message.reply(`Truth question '${value}' added successfully.`);
		} else if (type === "dare") {
			editJsonFile(`${__dirname}/assist_json/DAREQN.json`, value);
			message.reply(`Dare '${value}' added successfully.`);
		} else if (type === "truth-r") {
			const removed = removeJsonEntry(`${__dirname}/assist_json/TRUTHQN.json`, value);
			if (removed) {
				message.reply(`Truth question '${value}' removed successfully.`);
			} else {
				message.reply(`Truth question '${value}' not found.`);
			}
		} else if (type === "dare-r") {
			const removed = removeJsonEntry(`${__dirname}/assist_json/DAREQN.json`, value);
			if (removed) {
				message.reply(`Dare '${value}' removed successfully.`);
			} else {
				message.reply(`Dare '${value}' not found.`);
			}
		} else {
			message.reply("Invalid command. Please use `/tdedit truth 'qn'` or `/tdedit dare 'dare'`.");
		}
	}
};

function editJsonFile(filePath, value) {
	const jsonData = JSON.parse(fs.readFileSync(filePath));
	jsonData.push(value);
	fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
}

function removeJsonEntry(filePath, value) {
	const jsonData = JSON.parse(fs.readFileSync(filePath));
	const index = jsonData.indexOf(value);
	if (index > -1) {
		jsonData.splice(index, 1);
		fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
		return true; // Return true if removed successfully
	}
	return false; // Return false if not found
    }
