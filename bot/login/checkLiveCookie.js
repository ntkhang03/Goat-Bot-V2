const axios = require("axios");

module.exports = async function (cookie, userAgent) {
	const response = await axios({
		url: 'https://m.facebook.com',
		method: "GET",
		headers: {
			cookie,
			'user-agent': userAgent || 'Mozilla/5.0 (Linux; Android 12; M2102J20SG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36'
		}
	});
	if (response.data.includes('"USER_ID":"0"') || !response.data.includes('USER_ID'))
		return false;
	return true;
};