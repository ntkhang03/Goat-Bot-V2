const axios = require('axios');

module.exports = {
	config: {
		name: "download",
		version: "1.0",
		author: "loufi",
		countDown: 0,
		role: 0,
		shortDescription: "Downdload Instagram video",
		longDescription: "download Instagram video's,story,reels, photo etc.",
		category: "media",
		guide: "{pn} link"
	},

	onStart: async function ({ message, args }) {
		const name = args.join(" ");
		if (!name)
			return message.reply(`Please enter a link 🙂🙌`);
		else {
			const BASE_URL = `https://www.nguyenmanh.name.vn/api/igDL?url=${encodeURIComponent(name)}=&apikey=SyryTUZn`;

       await message.reply("Downloading video please wait....");

      
			try {
				let res = await axios.get(BASE_URL)

      
         let title = res.data.result.title
			
				let img =  res.data.result.video[0].url;

				const form = {
					body: `${title}`
				};
		  if (img)
					form.attachment = await global.utils.getStreamFromURL(img);
				message.reply(form);  
			} catch (e) { message.reply(`Sorry Link is not supported🥺`)
                  console.log(e);
                  }

		}
	}
};