module.exports = {
	config: {
		name: "pussy",
		aliases: ["18+"],
		version: "1.0",
		author: "Doru fix by kivv",
		countDown: 5,
		role: 2,
		shortDescription: "send you pic of pussy",
		longDescription: "sends u pic of girls pussy",
		category: "18+",
		guide: "{pn}"
	},

	onStart: async function ({ message }) {
	 var link = [ 
"https://i.ibb.co/jfqMF07/image.jpg",
"https://i.ibb.co/tBBCS4y/image.jpg",
"https://i.ibb.co/3zpyMVY/image.jpg",
"https://i.ibb.co/gWbWT8k/image.jpg",
"https://i.ibb.co/mHtyD1P/image.jpg",
"https://i.ibb.co/vPHNhdY/image.jpg",
"https://i.ibb.co/rm6rPjb/image.jpg",
"https://i.ibb.co/7GpN2GW/image.jpg",
"https://i.ibb.co/CnfMVpg/image.jpg",
  ]
let img = link[Math.floor(Math.random()*link.length)]
message.send({
  body: '「 Pussy💦🥵 」',attachment: await global.utils.getStreamFromURL(img)
})
}
     }
