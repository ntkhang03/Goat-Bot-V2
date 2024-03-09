module.exports = {
    config: {
        name: 'date',
        version: '1.0',
        author: 'Hassan',
        shortDescription: {
            en: 'Display current date.'
        },
        longDescription: {
            en: 'Displays the current date.'
        },
        category: 'Utility',
        guide: {
            en: 'Simply use the command to see the current date.'
        }
    },
    onStart: async function ({ api, event }) {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();

        const dateMessage = `Current date: ${formattedDate}`;

        api.sendMessage(dateMessage, event.threadID);
    }
};
