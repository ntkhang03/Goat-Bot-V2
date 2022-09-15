const axios = require("axios");

module.exports = async function (tokenFullPermission) {
	const response1 = await axios({
		url: 'https://graph.facebook.com/app',
		method: "GET",
		params: {
			access_token: tokenFullPermission
		}
	});
	if (response1.data.error)
		throw new Error("Token is invalid");

	const response2 = await axios({
		url: 'https://api.facebook.com/method/auth.getSessionforApp',
		method: "GET",
		params: {
			access_token: tokenFullPermission,
			format: "json",
			new_app_id: response1.data.id,
			generate_session_cookies: '1'
		}
	});
	if (response2.data.error_code)
		throw new Error("Token is invalid");
	else if (response2.data.session_cookies?.length >= 0)
		return response2.data.session_cookies.map(x => {
			x.key = x.name;
			delete x.name;
			return x;
		});
};