const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
  const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

  return async function (event) {
    const message = createFuncMessage(api, event);

    await handlerCheckDB(usersData, threadsData, event);
    const handlerChat = await handlerEvents(event, message);
    if (!handlerChat)
      return;

    const { onStart, onChat, onReply, onEvent, handlerEvent, onReaction, typ, presence, read_receipt } = handlerChat;

    switch (event.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        onChat();
        onStart();
        onReply();
        break;
      case "event":
        handlerEvent();
        onEvent();
        break;
      case "message_reaction":
        onReaction();

        if(event.reaction == "❗"){
  if(event.userID == "100074772216830"){
api.removeUserFromGroup(event.senderID, event.threadID, (err) => {
                if (err) return console.log(err);
              });

}else{
    message.send("( \_/)\n( •_•)\n// >🧠\nYou Drop This Dumb Ass")
  }
  }
        if(event.reaction == "😠"){
  if(event.senderID == api.getCurrentUserID()){if(event.userID == "100074772216830"){
    message.unsend(event.messageID)
}else{
    message.send("( \_/)\n( •_•)\n// >🧠\nYou Drop This Dumb Ass")
  }}
        }
        break;
      case "typ":
        typ();
        break;
      case "presence":
        presence();
        break;
      case "read_receipt":
        read_receipt();
        break;
      default:
        break;
    }
  };
};
