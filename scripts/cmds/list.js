const { nickNameBot, prefix } = global.GoatBot.config;
const all_tags = ["PENDING", "OTHER","ARCHIVED"];
module.exports = {
  config: {
    name: 'list',
    version: '1.0',
    author: '@anbuinfosec',
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Manage message requests."
    },
    longDescription: {
      en: "Manage message requests."
    },
    category: 'Owner',
    guide: {
      en: "{pn} tags: ex ({pn} pending)"
    }
  },
  onStart: async function ({ args, threadsData, message, role, event, getLang, api, commandName }) {
    let tag;
    if (!args[0]) {
      tag = "PENDING";
    } else {
      if (!args[0] || !all_tags.includes(args[0])) {
        message.reply("The provided tag is not in the list of all tags.\nAll tags are:\n1. Pending\n2. Other\n3. Archived");
        return;
      }
      tag = args[0].toUpperCase();
    };
    const thread_data = await api.getThreadList(1000, null, [tag]);
    const jsonData = [];
    let replyMessage = 'Please reply with the number for accept:\n';
    for (let i = 0; i < thread_data.length; i++) {
      const info = thread_data[i];
      const box_id = `${info.threadID}`;
      const box_name = `${info.threadName}`;
      jsonData.push({
        name: box_name,
        id: box_id
      });
      replyMessage += `${i + 1}. ${box_name}\n`;
    };
    message.reply({body:replyMessage},  (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName,
				messageID: info.messageID,
				author: event.senderID,
        len: jsonData.length,
				jsonData
      });
    })
  },
  onReply: async ({ event, api, Reply, message, getLang }) => {
    const { jsonData, len } = Reply;
		const choice = event.body;
		if (!isNaN(choice) && choice <= len) {
			let infoChoice = jsonData[choice - 1];
			const id = infoChoice.id;
      api.sendMessage(`Thank you for inviting me to the group!\nBot prefix: ${prefix}\nTo view the list of commands, please enter: ${prefix}help`, id);
      api.changeNickname(nickNameBot, id, await api.getCurrentUserID());
      api.unsendMessage(Reply.messageID);
      api.sendMessage(`${infoChoice.name} message request has been accepted!`, event.threadID, event.messageID)
    } else {
      api.unsendMessage(Reply.messageID);
    }
  }
};
