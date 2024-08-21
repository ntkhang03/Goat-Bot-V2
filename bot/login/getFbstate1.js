const cheerio = require("cheerio");
const qs = require('qs');

const targetCookie = "https://m.facebook.com/";
const urlLoginCheckpoint = "https://m.facebook.com/login/checkpoint/?next=https://m.facebook.com/home.php?refsrc=deprecated";

const headers = {
	"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
	"accept-language": "vi,en-US;q=0.9,en;q=0.8",
	"sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Microsoft Edge\";v=\"103\", \"Chromium\";v=\"103\"",
	"sec-ch-ua-mobile": "?0",
	"sec-ch-ua-platform": "\"Windows\"",
	"sec-fetch-dest": "document",
	"sec-fetch-mode": "navigate",
	"sec-fetch-site": "none",
	"sec-fetch-user": "?1",
	"upgrade-insecure-requests": "1",
	"user-agent": "Mozilla/5.0 (Linux; Android 12; M2102J20SG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36"
};

async function checkAndSaveCookies(jar, headers, request) {
	const resHome = await request({
		url: 'https://m.facebook.com/',
		method: 'GET',
		jar,
		headers
	});
	// const path = resHome.request.uri.path;
	const referer = resHome.request.headers.referer || '';
	if (referer.match(/checkpoint\/\d+/)) {
		const codeCheckpoint = referer.match(/checkpoint\/(\d+)/)[1];
		const error = new Error(`Your account has been checkpointed ${codeCheckpoint} by Facebook. Please login to your account and complete the checkpoint process.`);
		error.name = `CHECKPOINT_${codeCheckpoint}`;
		throw error;
	}
	else {
		return jar.getCookies(targetCookie);
	}
}


module.exports = async function (email, pass, userAgent, proxy) {
	headers['user-agent'] = userAgent || headers['user-agent'];
	let _request;
	if (proxy)
		_request = require("request").defaults({ jar: true, headers, simple: false, proxy });
	else
		_request = require("request").defaults({ jar: true, headers, simple: false });

	const request = (options) => {
		return new Promise((resolve, reject) => {
			_request(options, (err, res) => {
				if (err) return reject(err);
				resolve(res);
			});
		});
	};
	const jar = _request.jar();
	jar.setCookie(`locale=en_US`, targetCookie);

	const res1 = await request({
		url: 'https://m.facebook.com/login/',
		method: 'GET',
		jar
	});
	let $ = cheerio.load(res1.body);
	const formData1 = { ...qs.parse($('#login_form').serialize()) };
	delete formData1.pass;
	formData1.email = email;
	formData1.encpass = `#PWD_BROWSER:0:${~~(Date.now() / 1000)}:${pass}`;
	formData1.prefill_contact_point = email;
	formData1.bi_wvdp = `{"hwc":true,"hwcr":true,"has_dnt":true,"has_standalone":false,"wnd_toStr_toStr":"function toString() { [native code] }","hasPerm":true,"permission_query_toString":"function query() { [native code] }","permission_query_toString_toString":"function toString() { [native code] }","has_seWo":true,"has_meDe":true,"has_creds":true,"has_hwi_bt":false,"has_agjsi":false,"iframeProto":"function get contentWindow() { [native code] }","remap":false,"iframeData":{"hwc":true,"hwcr":false,"has_dnt":true,"has_standalone":false,"wnd_toStr_toStr":"function toString() { [native code] }","hasPerm":true,"permission_query_toString":"function query() { [native code] }","permission_query_toString_toString":"function toString() { [native code] }","has_seWo":true,"has_meDe":true,"has_creds":true,"has_hwi_bt":false,"has_agjsi":false}}`;
	formData1.prefill_source = 'browser_dropdown';
	formData1.prefill_type = 'password';
	formData1.first_prefill_source = 'browser_dropdown';
	formData1.first_prefill_type = 'contact_point';
	formData1.had_cp_prefilled = 'true';
	formData1.had_password_prefilled = 'true';
	formData1.is_smart_lock = 'false';
	formData1.bi_xrwh = '0';
	formData1.try_number = '0';
	formData1.unrecognized_tries = '0';
	const res2 = await request({
		url: 'https://m.facebook.com/login/device-based/login/async/?refsrc=deprecated&lwv=100',
		method: 'POST',
		jar,
		form: formData1
	});

	if (res2.body.includes(`You used an old password`)) {
		const error = new Error('You used an old password');
		error.name = 'OLD_PASSWORD';
		throw error;
	}

	if (
		res2.body.includes(`href=\\"\\/recover\\/initiate\\/?email=${email}&amp;ars=facebook_login_pw_error`)
		|| res2.body.includes(`"m_login_notice":"Invalid username or password"`)
		|| res2.body.includes(`Incorrect password.`)
		|| res2.body.includes(`forgot_password_uri`)
		|| res2.headers.location?.includes(`m_lara_first_password_failure`)
	) {
		const error = new Error('Wrong username or password');
		error.name = 'WRONG_ACCOUNT';
		throw error;
	}


	if (jar.getCookieString(targetCookie).includes('c_user'))
		return await checkAndSaveCookies(jar, headers, request);

	const res3 = await request({
		url: 'https://m.facebook.com/checkpoint/?next=https://m.facebook.com/home.php?refsrc=deprecated&__req=6',
		jar,
		method: 'GET'
	});
	if (jar.getCookieString(targetCookie).includes('c_user'))
		return await checkAndSaveCookies(jar, headers, request);

	$ = cheerio.load(res3.body);
	if (!res2.body && res3.body.includes('<form method="post" action="/login/device-based') && $('button[name="login"]').length) {
		const error = new Error('Cannot login to facebook account, please login to your account to check and fix this problem');
		error.name = 'CANNOT_LOGIN';
		throw error;
	}

	const formData2 = { ...qs.parse($('form[method="post"][class="checkpoint"]').serialize()) };
	formData2['submit[Submit Code]'] = $('button[name="submit[Submit Code]"]').text();

	if (($('title').text() || '').includes('Login approval needed'))
		throw {
			name: 'LOGIN_APPROVED_REQUIRE',
			message: 'You need to verify login for this device, please login to your account with the device you normally use to verify your login'
		};

	if ($('#checkpoint_title')?.text()?.includes('Enter login code to continue')) {
		throw {
			name: '2FA_CODE_REQUIRED',
			message: '2FA code is required, call function continue to submit 2FA code',
			continue: async function submit2FA(code) {
				formData2.approvals_code = code;
				const res4 = await request({
					url: urlLoginCheckpoint,
					method: 'POST',
					form: formData2,
					jar
				});
				if (jar.getCookieString(targetCookie).includes('c_user'))
					return await checkAndSaveCookies(jar, headers, request);


				$ = cheerio.load(res4.body);
				if ($('button[name="submit[Submit Code]"]').text() == formData2['submit[Submit Code]'])
					throw {
						name: '2FA_CODE_INVALID',
						message: '2FA code is invalid',
						continue: submit2FA
					};

				const formData3 = { ...qs.parse($('form[method="post"][class="checkpoint"]').serialize()) };
				delete formData3.approvals_code;
				formData3.name_action_selected = 'save_device'; // or dont_save
				formData3['submit[Continue]'] = $('#checkpointSubmitButton').text();
				const res5 = await request({
					url: urlLoginCheckpoint,
					method: 'POST',
					form: formData3,
					jar
				});

				if (jar.getCookieString(targetCookie).includes('c_user'))
					return await checkAndSaveCookies(jar, headers, request);


				$ = cheerio.load(res5.body);
				const formData4 = {
					...qs.parse($('form[method="post"][class="checkpoint"]').serialize())
				};
				delete formData4.approvals_code;
				formData4['submit[Continue]'] = $('button[name="submit[Continue]"]').text();
				const res6 = await request({
					url: urlLoginCheckpoint,
					method: 'POST',
					form: formData4,
					jar
				});
				if (jar.getCookieString(targetCookie).includes('c_user'))
					return await checkAndSaveCookies(jar, headers, request);


				$ = cheerio.load(res6.body);
				const formData5 = { ...qs.parse($('form[method="post"][class="checkpoint"]').serialize()) };
				delete formData5.approvals_code;
				formData5['submit[This was me]'] = $('button[name="submit[This was me]"]').text();
				const res7 = await request({
					url: urlLoginCheckpoint,
					method: 'POST',
					form: formData5,
					jar
				});
				if (jar.getCookieString(targetCookie).includes('c_user'))
					return await checkAndSaveCookies(jar, headers, request);


				$ = cheerio.load(res7.body);
				const formData6 = { ...qs.parse($('form[method="post"][class="checkpoint"]').serialize()) };
				delete formData6.approvals_code;
				formData6.name_action_selected = 'save_device'; // or dont_save
				formData6['submit[Continue]'] = $('#checkpointSubmitButton').text();
				await request({
					url: urlLoginCheckpoint,
					method: 'POST',
					form: formData6,
					jar
				});

				if (jar.getCookieString(targetCookie).includes('c_user'))
					return await checkAndSaveCookies(jar, headers, request);

				const error = new Error("Can't login to Facebook, please login to your account to check and fix this problem");
				error.name = "LOGIN_FAILED";
				throw error;
			}
		};
	}

	const error = new Error("Can't login to Facebook, please login to your account to check and fix this problem");
	error.name = "LOGIN_FAILED";
	error.response = res3;
	throw error;
};
