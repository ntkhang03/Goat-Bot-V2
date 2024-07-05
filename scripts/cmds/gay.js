const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
	config: {
		name: "gay",
		version: "1.0",
		author: "@tas33n",
		countDown: 1,
		role: 0,
		shortDescription: "find gay",
		longDescription: "",
		category: "box chat",
		guide: "{pn} {{[on | off]}}",
		envConfig: {
			deltaNext: 5
		}
	},

	langs: {
		vi: {
			noTag: "Bạn phải tag người bạn muốn tát"
		},
		en: {
			noTag: "You must tag the person you want to "
		}
	},

	onStart: async function ({ event, message, usersData, args, getLang }) 
  {

    let mention = Object.keys(event.mentions)
    let uid;
  
    // const img = await new DIG.Gay().getImage(url);
    
    
		if(event.type == "message_reply"){
    uid = event.messageReply.senderID
    } else{
      if (mention[0]){
        uid = mention[0]
      }else{
        console.log(" jsjsj")
        uid = event.senderID}
    }

let url = await usersData.getAvatarUrl(uid)
let avt = await new DIG.Gay().getImage(url)


	// 	message.reply({
	// 		body:"",
	// 		attachment: await global.utils.getStreamFromURL(avt)
	// })
  		const pathSave = `${__dirname}/tmp/gay.png`;
	fs.writeFileSync(pathSave, Buffer.from(avt));
    let body = "look.... i found a gay"
    if(!mention[0]) body="Baka you gay\nforgot to reply or mention someone"
    message.reply({body:body,
attachment: fs.createReadStream(pathSave)
		}, () => fs.unlinkSync(pathSave));

    
  }
};









// 	onStart: async function ({ message, event, usersData, threadsData, args }) {

    

    
// 		if(event.type == "message_reply"){
//       avt = await usersData.getAvatarUrl(event.messageReply.senderID)
//     } else{
//       if (!uid2){avt =  await usersData.getAvatarUrl(uid1)
//               } else{avt = await usersData.getAvatarUrl(uid2)}}


// 		message.reply({body:"Look.... I found a gay",
// attachment: fs.createReadStream(pathSave)
// 		}, () => fs.unlinkSync(pathSave));

    

   

// message.send({body:"Look.... I found a gay",
// attachment: fs.createReadStream(pathSave)
// 		}, () => fs.unlinkSync(pathSave));
    
// st fs = require("fs-extra");
// let url = await usersData.getAvatarUrl(event.messageReply.senderID)
// // const img = await new DIG.Gay().getImage(url);
		// const pathSave = `${__dirname}/tmp/gay.png`;
		// fs.writeFileSync(pathSave, Buffer.from(avt));

// // message.send({body:"Look.... I found a gay",
// // attachment: fs.createReadStream(pathSave)
// // 		}, () => fs.unlinkSync(pathSave));

    
// 	}



  
// }