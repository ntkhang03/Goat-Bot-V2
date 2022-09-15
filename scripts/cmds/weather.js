const axios = require("axios");
const moment = require("moment-timezone");
const Canvas = require("canvas");
const fs = require("fs-extra");

Canvas.registerFont(
	__dirname + "/assets/font/BeVietnamPro-SemiBold.ttf", {
	family: "BeVietnamPro-SemiBold"
});
Canvas.registerFont(
	__dirname + "/assets/font/BeVietnamPro-Regular.ttf", {
	family: "BeVietnamPro-Regular"
});

function convertFtoC(F) {
	return Math.floor((F - 32) / 1.8);
}
function formatHours(hours) {
	return moment(hours).tz("Asia/Ho_Chi_Minh").format("HH[h]mm[p]");
}

module.exports = {
	config: {
		name: "weather",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: "dự báo thời tiết",
		longDescription: "xem dự báo thời tiết hiện tại và 5 ngày sau",
		category: "other",
		guide: "{pn} <địa điểm>",
		envGlobal: {
			weatherApiKey: "d7e795ae6a0d44aaa8abb1a0a7ac19e4"
		}
	},

	onStart: async function ({ args, message, envGlobal }) {
		const apikey = envGlobal.weatherApiKey;

		const area = args.join(" ");
		if (!area)
			return message.reply("Vui lòng nhập địa điểm");
		let areaKey, dataWeather;

		try {
			const response = (await axios.get(`https://api.accuweather.com/locations/v1/cities/search.json?q=${encodeURIComponent(area)}&apikey=${apikey}&language=vi-vn`)).data;
			if (response.length == 0)
				return message.reply(`Không thể tìm thấy địa điểm: {{${area}}}`);
			const data = response[0];
			areaKey = data.Key;
		}
		catch (err) {
			return message.reply(`❌ Đã xảy ra lỗi: {{${err.response.data.Message}}}`);
		}

		try {
			dataWeather = (await axios.get(`http://api.accuweather.com/forecasts/v1/daily/10day/${areaKey}?apikey=${apikey}&details=true&language=vi`)).data;
		}
		catch (err) {
			return message.reply(`❌ Đã xảy ra lỗi: {{${err.response.data.Message}}}`);
		}

		const dataWeatherDaily = dataWeather.DailyForecasts;
		const dataWeatherToday = dataWeatherDaily[0];
		const msg = `Thời tiết hôm nay:\n${dataWeather.Headline.Text}`
			+ `\n🌡 Nhiệt độ thấp nhất - cao nhất {{${convertFtoC(dataWeatherToday.Temperature.Minimum.Value)}°C}} - {{${convertFtoC(dataWeatherToday.Temperature.Maximum.Value)}°C}}`
			+ `\n🌡 Nhiệt độ cảm nhận được {{${convertFtoC(dataWeatherToday.RealFeelTemperature.Minimum.Value)}°C}} - {{${convertFtoC(dataWeatherToday.RealFeelTemperature.Maximum.Value)}°C}}`
			+ `\n🌅 Mặt trời mọc ${formatHours(dataWeatherToday.Sun.Rise)}`
			+ `\n🌄 Mặt trời lặn ${formatHours(dataWeatherToday.Sun.Set)}`
			+ `\n🌃 Mặt trăng mọc ${formatHours(dataWeatherToday.Moon.Rise)}`
			+ `\n🏙️ Mặt trăng lặn ${formatHours(dataWeatherToday.Moon.Set)}`
			+ `\n🌞 Ban ngày: ${dataWeatherToday.Day.LongPhrase}`
			+ `\n🌙 Ban đêm: ${dataWeatherToday.Night.LongPhrase}`;

		const bg = await Canvas.loadImage(__dirname + "/assets/image/bgWeather.jpg");
		const { width, height } = bg;
		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");
		ctx.drawImage(bg, 0, 0, width, height);
		let X = 100;
		ctx.fillStyle = "#ffffff";
		const data = dataWeather.DailyForecasts.slice(0, 7);
		for (const item of data) {
			const icon = await Canvas.loadImage("http://vortex.accuweather.com/adc2010/images/slate/icons/" + item.Day.Icon + ".svg");
			ctx.drawImage(icon, X, 210, 80, 80);

			ctx.font = "30px BeVietnamPro-SemiBold";
			const maxC = `${convertFtoC(item.Temperature.Maximum.Value)}°C `;
			ctx.fillText(maxC, X, 366);

			ctx.font = "30px BeVietnamPro-Regular";
			const minC = String(`${convertFtoC(item.Temperature.Minimum.Value)}°C`);
			const day = moment(item.Date).format("DD");
			ctx.fillText(minC, X, 445);
			ctx.fillText(day, X + 20, 140);

			X += 135;
		}

		const pathSaveImg = `${__dirname}/tmp/weather_${areaKey}.jpg`;
		fs.writeFileSync(pathSaveImg, canvas.toBuffer());

		return message.reply({
			body: msg,
			attachment: fs.createReadStream(pathSaveImg)
		}, () => fs.unlinkSync(pathSaveImg));

	}
};