const axios = require('axios');

module.exports = {
	config: {
		name: "instagram",
		aliases: ["insta"],
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "Xem info user insta",
		longDescription: "Xem thông tin người dùng instagram bằng username",
		category: "info",
		guide: "{pn} {{<username>}}"
	},

	onStart: async function ({ message, args }) {
		const userName = args.join(" ");
		if (!userName)
			return message.reply(`⚠️ | Vui Lòng nhập username instagram!`);
		else {
			let infoUserInstagram;
			try {
				infoUserInstagram = await getInfo(userName);
			}
			catch (err) {
				if (err.message == "Not found")
					return message.reply(`❌ | Không tìm thấy username {{${userName}}}`);
				message.reply(`Lỗi: ${err.message}`);
			}
			const { full_name, biography, posts, followers, following, picture_url, private, verified, reels } = infoUserInstagram;
			const form = {
				body: `===「USER INSTAGRAM」===`
					+ `\n🔠 Tên: {{${full_name}}}`
					+ `\n#️⃣ Số bài viết: ${posts}`
					+ `\n📺 Video story: ${reels}`
					+ `\n👀 Người theo dõi: ${followers}`
					+ `\n♻️ Đang theo dõi: ${following}`
					+ `\n🔒 Chế độ riêng tư: ${private ? "Có" : "Không"}`
					+ `\n✅ Xác minh: ${verified ? "Có" : "Không"}`
					+ `\n📑 Tiểu sử: ${`{{${biography}}}` || "Không có"}`
			};
			if (picture_url)
				form.attachment = await global.utils.getStreamFromURL(picture_url);
			message.reply(form);
		}
	}
};

async function getInfo(userName) {
	const BASE_URL = `https://instagram.com/${userName}`;
	const { data: response } = await axios.get(BASE_URL);
	const getForm = response.split(`requireLazy(["JSScheduler","ServerJS","ScheduledApplyEach"],function(JSScheduler,ServerJS,ScheduledApplyEach){JSScheduler.runWithPriority(3,function(){(new ServerJS()).handleWithCustomApplyEach(ScheduledApplyEach,`);
	if (!getForm[2])
		throw new Error("Not found");
	const json = getForm[2].split(`);});});</script>`)[0];
	let user;
	try {
		user = JSON.parse(JSON.parse(json).require[0][3][0].data.__bbox.result.response).data.user;
	}
	catch (e) {
		throw new Error("Not found");
	}

	return {
		biography: user.biography,
		followers: user.edge_followed_by.count,
		following: user.edge_follow.count,
		uploads: user.edge_owner_to_timeline_media.count,
		full_name: user.full_name,
		picture_url: user.profile_pic_url_hd,
		posts: user.edge_owner_to_timeline_media.count,
		reels: user.highlight_reel_count,
		private: user.is_private,
		verified: user.is_verified
	};
}