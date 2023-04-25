const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const fs = require('fs-extra');
const seesion = require('express-session');
const eta = require('eta');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const Passport = require('passport');
const bcrypt = require('bcrypt');
const axios = require('axios');
const mimeDB = require('mime-db');
const http = require('http');
const server = http.createServer(app);

const imageExt = ['png', 'gif', 'webp', 'jpeg', 'jpg'];
const videoExt = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'rrc', 'gifv',
	'mng', 'mov', 'avi', 'qt', 'wmv', 'yuv', 'rm', 'asf', 'amv', 'mp4',
	'm4p', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'm4v', 'svi', '3gp',
	'3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b', 'mod'
];
const audioExt = ['3gp', 'aa', 'aac', 'aax', 'act', 'aiff', 'alac', 'amr',
	'ape', 'au', 'awb', 'dss', 'dvf', 'flac', 'gsm', 'iklax', 'ivs',
	'm4a', 'm4b', 'm4p', 'mmf', 'mp3', 'mpc', 'msv', 'nmf',
	'ogg', 'oga', 'mogg', 'opus', 'ra', 'rm', 'raw', 'rf64', 'sln', 'tta',
	'voc', 'vox', 'wav', 'wma', 'wv', 'webm', '8svx', 'cd'
];


module.exports = async (api) => {
	if (!api)
		await require('./connectDB.js')();

	const { utils, utils: { drive } } = global;
	const { config } = global.GoatBot;
	const { expireVerifyCode } = config.dashBoard;
	const { gmailAccount, gRecaptcha } = config.credentials;

	const {
		email,
		clientId,
		clientSecret,
		refreshToken
	} = gmailAccount;

	const OAuth2 = google.auth.OAuth2;
	const OAuth2_client = new OAuth2(clientId, clientSecret);
	OAuth2_client.setCredentials({ refresh_token: refreshToken });
	let accessToken;
	try {
		accessToken = await OAuth2_client.getAccessToken();
	}
	catch (err) {
		throw new Error('refresh token google api đã hết hạn hoặc bị thu hồi, vui lòng lấy lại token mới tại https://developers.google.com/oauthplayground/');
	}

	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		service: 'Gmail',
		auth: {
			type: 'OAuth2',
			user: email,
			clientId,
			clientSecret,
			refreshToken,
			accessToken
		}
	});


	const {
		threadModel,
		userModel,
		dashBoardModel,
		threadsData,
		usersData,
		dashBoardData
	} = global.db;


	// const verifyCodes = {
	//     fbid: [],
	//     register: [],
	//     forgetPass: []
	// };

	eta.configure({
		useWith: true
	});
	app.set('views', `${__dirname}/views`);
	app.engine("eta", eta.renderFile);
	app.set("view engine", "eta");

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(cookieParser());
	app.use(seesion({
		secret: randomStringApikey(10),
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false,
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
		}
	}));


	// public folder 
	app.use('/css', express.static(`${__dirname}/css`));
	app.use('/images', express.static(`${__dirname}/images`));

	require('./passport-config.js')(Passport, dashBoardData, bcrypt);
	app.use(Passport.initialize());
	app.use(Passport.session());
	app.use(fileUpload());

	app.use(flash());
	app.use(function (req, res, next) {
		res.locals.gRecaptcha_siteKey = gRecaptcha.siteKey;
		res.locals.__dirname = __dirname;
		res.locals.success = req.flash('success');
		res.locals.errors = req.flash('errors');
		res.locals.user = req.user || null;
		res.locals.warnings = req.flash('warnings');
		next();
	});

	const generateEmailVerificationCode = require('./scripts/generate-Email-Verification.js');

	// ————————————————— MIDDLEWARE ————————————————— //
	const createLimiter = (ms, max) => rateLimit({
		windowMs: ms, // 5 minutes
		max,
		handler: (req, res) => {
			res.status(429).send({
				status: 'error',
				message: 'Too many requests in the last minute. Please try again later.'
			});
		}
	});

	const middleWareForGetMethod = require('./middleware/get.js')(getThreadDataSync, checkAuthConfigDashboardOfThread);
	const middleWareForPostMethod = require('./middleware/post.js')(getThreadDataSync, checkAuthConfigDashboardOfThread);

	// ————————————————————————————————————————————— //

	function checkAuthConfigDashboardOfThread(threadData, userID) {
		if (!isNaN(threadData))
			threadData = getThreadDataSync(threadData) || {};
		return threadData.adminIDs?.includes(userID) || threadData.members?.some(m => m.userID == userID && m.permissionConfigDashboard == true) || false;
	}

	function getThreadDataSync(threadID) {
		return threadsData.getAll().find(t => t.threadID == threadID);
	}

	function getUserDataSync(userID) {
		return usersData.getAll().find(u => u.userID == userID);
	}

	const isVideoFile = (mimeType) => videoExt.includes(mimeDB[mimeType]?.extensions?.[0]);

	async function isVerifyRecaptcha(responseCaptcha) {
		const secret = gRecaptcha.secretKey;
		const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${responseCaptcha}`;
		const verify = await axios.get(verifyUrl);
		return verify.data.success;
	}


	// ROUTES
	const {
		unAuthenticated: unAuthenticated_G,
		isWaitVerifyAccount: isWaitVerifyAccount_G,
		isAuthenticated: isAuthenticated_G,
		isAdmin: isAdmin_G,
		isVeryfiUserIDFacebook: isVeryfiUserIDFacebook_G,
		checkHasAndInThread: checkHasAndInThread_G,
		middlewareCheckAuthConfigDashboardOfThread: middlewareCheckAuthConfigDashboardOfThread_G
	} = middleWareForGetMethod;

	const {
		unAuthenticated: unAuthenticated_P,
		isWaitVerifyAccount: isWaitVerifyAccount_P,
		isAuthenticated: isAuthenticated_P,
		isVeryfiUserIDFacebook: isVeryfiUserIDFacebook_P,
		checkHasAndInThread: checkHasAndInThread_P,
		middlewareCheckAuthConfigDashboardOfThread: middlewareCheckAuthConfigDashboardOfThread_P
	} = middleWareForPostMethod;

	const paramsForRoutes = {
		unAuthenticated_G, isWaitVerifyAccount_G, isAuthenticated_G, isVeryfiUserIDFacebook_G, checkHasAndInThread_G, middlewareCheckAuthConfigDashboardOfThread_G,
		unAuthenticated_P, isWaitVerifyAccount_P, isAuthenticated_P, isVeryfiUserIDFacebook_P, checkHasAndInThread_P, middlewareCheckAuthConfigDashboardOfThread_P,
		isVerifyRecaptcha, validateEmail, randomNumberApikey, transporter, generateEmailVerificationCode, dashBoardData, expireVerifyCode, Passport, isVideoFile,
		threadsData, api, createLimiter, config, checkAuthConfigDashboardOfThread, imageExt, videoExt, audioExt, convertSize, drive, usersData, getThreadDataSync
	};

	const registerRoute = require('./routes/register.js')(paramsForRoutes);
	const loginRoute = require('./routes/login.js')(paramsForRoutes);
	const forgotPasswordRoute = require('./routes/forgotPassword.js')(paramsForRoutes);
	const changePasswordRoute = require('./routes/changePassword.js')(paramsForRoutes);
	const dashBoardRoute = require('./routes/dashBoard.js')(paramsForRoutes);
	const verifyFbidRoute = require('./routes/verifyfbid.js')(paramsForRoutes);
	const apiRouter = require('./routes/api.js')(paramsForRoutes);

	app.get(['/', '/home'], (req, res) => {
		res.render('home');
	});


	app.get('/stats', (req, res) => {
		let fcaVersion;
		try {
			fcaVersion = require('fb-chat-api/package.json').version;
		}
		catch (e) {
			fcaVersion = 'unknown';
		}

		const totalThread = threadsData.getAll().filter(t => t.threadID.toString().length > 15).length;
		const totalUser = usersData.getAll().length;
		const prefix = config.prefix;
		const uptime = utils.convertTime(process.uptime() * 1000);

		res.render('stats', {
			fcaVersion,
			totalThread,
			totalUser,
			prefix,
			uptime,
			uptimeSecond: process.uptime()
		});
	});


	app.get('/profile', isAuthenticated_G, (req, res) => {
		res.render('profile', {
			userData: getUserDataSync(req.user.facebookUserID) || {}
		});
	});
	app.get('/donate', (req, res) => res.render('donate'));

	app.get('/logout', (req, res, next) => {
		req.logout(function (err) {
			if (err)
				return next(err);
			res.redirect('/');
		});
	});
	app.post('/changefbstate', isAuthenticated_P, isVeryfiUserIDFacebook_P, (req, res) => {
		if (!global.GoatBot.config.adminBot.includes(req.user.facebookUserID))
			return res.send({
				status: "error",
				message: 'Bạn không có quyền thay đổi fbstate!'
			});
		const { fbstate } = req.body;
		if (!fbstate)
			return res.send({
				status: "error",
				message: 'Vui lòng nhập fbstate!'
			});

		fs.writeFileSync(process.cwd() + (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "development" ? '/account.dev.txt' : '/account.txt'), fbstate);
		res.send({
			status: "success",
			message: 'Đã thay đổi fbstate thành công!'
		});
		res.on('finish', () => {
			process.exit(2);
		});
	});
	app.get('/uptime', global.responseUptimeCurrent);
	app.get('/changefbstate', isAuthenticated_G, isVeryfiUserIDFacebook_G, isAdmin_G, (req, res) => {
		res.render('changeFbstate', {
			currentFbstate: fs.readFileSync(process.cwd() + (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "development" ? '/account.dev.txt' : '/account.txt'), 'utf8')
		});
	});

	app.use('/register', registerRoute);
	app.use('/login', loginRoute);
	app.use('/forgot-password', forgotPasswordRoute);
	app.use('/change-password', changePasswordRoute);
	app.use('/dashboard', dashBoardRoute);
	app.use('/verifyfbid', verifyFbidRoute);
	app.use('/api', apiRouter);

	app.get('*', (req, res) => {
		res.status(404).render('404');
	});

	// catch global error	
	app.use((err, req, res, next) => {
		if (err.message == "Login sessions require session support. Did you forget to use `express-session` middleware?")
			return res.status(500).send('Server an error, please try again later!');
	});

	const PORT = config.dashBoard.port || config.serverUptime.port || 3001;
	let urlDashBoard = `https://${process.env.REPL_OWNER
		? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
		: process.env.API_SERVER_EXTERNAL == "https://api.glitch.com"
			? `${process.env.PROJECT_DOMAIN}.glitch.me`
			: `localhost:${PORT}`}`;
	urlDashBoard.includes('localhost') && (urlDashBoard = urlDashBoard.replace('https', 'http'));
	await server.listen(PORT);
	utils.log.info('DASHBOARD', `Dashboard is running: ${urlDashBoard}`);
	if (config.serverUptime.socket.enable == true)
		require('../bot/login/socketIO.js')(server);
};

function randomStringApikey(max) {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < max; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function randomNumberApikey(maxLength) {
	let text = '';
	const possible = '0123456789';
	for (let i = 0; i < maxLength; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function validateEmail(email) {
	const re = /^(([^<>()\[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function convertSize(byte) {
	return byte > 1024 ? byte > 1024 * 1024 ? (byte / 1024 / 1024).toFixed(2) + ' MB' : (byte / 1024).toFixed(2) + ' KB' : byte + ' Byte';
}

