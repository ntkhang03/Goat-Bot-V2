module.exports = {
    config: {
        name: "sendmoney",
        version: "1.0",
        author: "Hassan",
        shortDescription: {
            en: "Send money to another user",
        },
        longDescription: {
            en: "Command to transfer money to another user by UID.",
        },
        category: "Finance",
    },
    onStart: async function ({ args, message, event, usersData }) {
        const { senderID } = event;
        const senderData = await usersData.get(senderID);
        
        if (!senderData) {
            return message.reply("Error: Sender data not found.");
        }
        
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply("Please enter a valid positive amount to send.");
        } else if (amount > senderData.money) {
            return message.reply("Not enough money in your balance.");
        }
        
        const recipientUID = args[1];
        if (!recipientUID) {
            return message.reply("Error: Please provide a recipient UID.");
        }
        
        const recipientData = await usersData.get(recipientUID);
        if (!recipientData) {
            return message.reply("Recipient not found.");
        }
        
        await usersData.set(senderID, {
            money: senderData.money - amount,
            data: senderData.data,
        });
        
        await usersData.set(recipientUID, {
            money: (recipientData.money || 0) + amount,
            data: recipientData.data,
        });
        
        return message.reply(`Successfully sent $${amount} to UID: ${recipientUID}.`);
    },
};
