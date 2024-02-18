module.exports = {
	config: {
		name: "anix",
		aliases: ["anix"],
		version: "1.0",
		author: "aminul",
		countDown: 5,
		role: 0,
		shortDescription: "send you pic&video of gojo",
		longDescription: "",
		category: "anime",
		guide: "{pn}"
	},

	onStart: async function ({ message }) {
	 var link = [ "https://i.imgur.com/uykTmIq.mp4",

"https://i.imgur.com/OKv9G8S.mp4",

"https://i.imgur.com/JFB2EDm.mp4",

"https://i.imgur.com/AZ2yc7K.mp4",

"https://i.imgur.com/Vph1L6w.mp4",

"https://i.imgur.com/GJVqdS7.mp4",

"https://i.imgur.com/oHJCpVW.mp4",

"https://i.imgur.com/7U3piUc.mp4",

"https://i.imgur.com/lDDBFYH.mp4",

"https://i.imgur.com/OKv9G8S.mp4",

 "https://i.imgur.com/EmgFapW.mp4",

"https://i.imgur.com/0Zq5fIL.mp4",

"https://i.imgur.com/i8M9YeG.mp4",

"https://i.imgur.com/9k4f3cw.mp4",

"https://i.imgur.com/02bMIwx.mp4",

"https://i.imgur.com/cEX9Shv.mp4",

"https://i.imgur.com/9fb8kyN.mp4",


"https://i.imgur.com/Jmqzdzj.mp4",

"https://i.imgur.com/EmgFapW.mp4",
 
"https://i.imgur.com/i8M9YeG.mp4",

"https://i.imgur.com/cEX9Shv.mp4",
]

let img = link[Math.floor(Math.random()*link.length)]
message.send({
  body: '「 🌸anime 」',attachment: await global.utils.getStreamFromURL(img)
})
}
  }
