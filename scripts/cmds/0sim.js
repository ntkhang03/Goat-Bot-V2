export const setup = {
  name: "sim",
  version: "40.0.3",
  permission: "Users",
  creator: "John Lester",
  description: "Talk with simsimi",
  category: "chatbot",
  usages: ["[ask]", "on", "off"],
  cooldown: 10,
  isPrefix: true
};
export const domain = {"sim": setup.name};
let thread = {};
export const execCommand = async function({api, event, key, kernel, args, keyGenerator, Users, context, translate, usage, prefix}) {
  if(args.length === 0) return usage(this, prefix, event);
  let True = (args[0] && args[0].toLowerCase() === "on") ? true: (args[0] && args[0].toLowerCase() === "off") ? false : null;
  if(args.length === 0) return usage(this, prefix, event);
  let msg = await translate((True === true) ? "enabled": "disabled", event, null, true);
  if(True !== null) {
    thread[event.threadID] = True;
    return api.sendMessage(context+(await translate("✅ Sim successfully", event, null, true))+" "+msg, event.threadID, event.messageID);
  }
  let data = await kernel.read(["sim"], {key: key, id: event.senderID, ask: args.join(" ")});
  return api.sendMessage((await translate(data.answer, event, null, false)), event.threadID, event.messageID)
}
export const execEvent = async function({api, event, kernel, args, translate, key, cooldown, systemadmin}) {
  if(!thread.hasOwnProperty(event.threadID)) thread[event.threadID] = false;
  if((thread.hasOwnProperty(event.threadID) && thread[event.threadID] == false) || !systemadmin.includes(event.senderID) && cooldown.isCooldown(this.setup.name+event.senderID, this.setup.cooldown)) return; 
  let data = await kernel.read(["sim"], {key: key, id: event.senderID, ask: args.join(" ")});
  cooldown.create(this.setup.name+event.senderID);
  return api.sendMessage((await translate(data.answer, event, null, false)), event.threadID, event.messageID)
                  }
