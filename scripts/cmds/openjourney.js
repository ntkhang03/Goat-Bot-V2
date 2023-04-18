const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "openjourney",
		aliases: ["midjourney"],
		version: "1.2",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Tạo ảnh từ văn bản của bạn",
			en: "Create image from your text"
		},
		longDescription: {
			uid: "Tạo ảnh từ văn bản của bạn",
			en: "Create image from your text"
		},
		category: "info",
		guide: {
			vi: "   {pn} <prompt>: tạo ảnh từ văn bản của bạn",
			en: "   {pn} <prompt>: create image from your text"
		}
	},

	langs: {
		vi: {
			syntaxError: "⚠️ Vui lòng nhập prompt",
			error: "❗ Đã có lỗi xảy ra, vui lòng thử lại sau",
			serverError: "❗ Server đang quá tải, vui lòng thử lại sau"
		},
		en: {
			syntaxError: "⚠️ Please enter prompt",
			error: "❗ An error has occurred, please try again later",
			serverError: "❗ Server is overloaded, please try again later"
		}
	},

	onStart: async function ({ message, args, getLang }) {
		const prompt = args.join(" ");
		if (!prompt)
			return message.reply(getLang("syntaxError"));

		try {
			const data = await midJourney(prompt, {});
			const imageUrl = data[0];
			const imageStream = await getStreamFromURL(imageUrl, "openjourney.png");
			return message.reply({
				attachment: imageStream
			});
		}
		catch (err) {
			if (err.detail == "Request was throttled. Expected available in 1 second.")
				return message.reply(getLang("serverError"));
		}
	}
};

const ReplicateUtils = {
	run: async function (model, inputs) {
		let prediction;
		try {
			prediction = await this.create(model, inputs);
		}
		catch (e) {
			throw e.response.data;
		}
		while (![
			'canceled',
			'succeeded',
			'failed'
		].includes(prediction.status)) {
			await new Promise(_ => setTimeout(_, 250));
			prediction = await this.get(prediction);
		}

		return prediction.output;
	},

	async get(prediction) {
		if (prediction.prediction)
			return prediction.prediction;
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), 29000);
		const response = await axios.get(`https://replicate.com/api/models${prediction.version.model.absolute_url}/versions/${prediction.version_id}/predictions/${prediction.uuid}`, {
			signal: controller.signal
		}).then(r => r.data);
		clearTimeout(id);
		return response;
	},

	create(model, inputs) {
		const [path, version] = model.split(':');

		return axios({
			url: `https://replicate.com/api/models/${path}/versions/${version}/predictions`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({ inputs })
		})
			.then(response => response.data);
	}
};

const model = "prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb";
const midJourney = async (prompt, parameters = {}) => await ReplicateUtils.run(model, { prompt, ...parameters });
