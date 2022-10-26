const axios = require("axios");

module.exports = async function (cookie, userAgent) {
	const response = await axios({
		url: 'https://mbasic.facebook.com/settings',
		method: "GET",
		headers: {
			cookie,
			'user-agent': userAgent || 'Mozilla/5.0 (Linux; Android 12; M2102J20SG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36'
		}
	});
	return response.data.includes('/privacy/xcs/action/logging/') || response.data.includes('/notifications.php?');
};