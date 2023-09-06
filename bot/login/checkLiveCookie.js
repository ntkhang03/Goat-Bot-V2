const axios = require("axios");
/**
 * 
 * @param {string} cookie Cookie string as `c_user=123;xs=123;datr=123;` format
 * @param {string} userAgent User agent string
 * @returns {Promise<Boolean>} True if cookie is valid, false if not
 */
module.exports = async function (cookie, userAgent) {
	try {
		const response = await axios({
			url: 'https://mbasic.facebook.com/settings',
			method: "GET",
			headers: {
				cookie,
				"user-agent": userAgent || 'Mozilla/5.0 (Linux; Android 12; M2102J20SG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36',
				"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
				"accept-language": "vi,en-US;q=0.9,en;q=0.8",
				"sec-ch-prefers-color-scheme": "dark",
				"sec-ch-ua": "\"Chromium\";v=\"112\", \"Microsoft Edge\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": "\"Windows\"",
				"sec-fetch-dest": "document",
				"sec-fetch-mode": "navigate",
				"sec-fetch-site": "none",
				"sec-fetch-user": "?1",
				"upgrade-insecure-requests": "1"
			}
		});
		
		return response.data.includes('/privacy/xcs/action/logging/') || response.data.includes('/notifications.php?') || response.data.includes('href="/login/save-password-interstitial');
	}
	catch (e) {
		return false;
	}
};