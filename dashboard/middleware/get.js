module.exports = function (getThreadDataSync, checkAuthConfigDashboardOfThread) {
	return {
		isAuthenticated(req, res, next) {
			if (req.isAuthenticated())
				return next();
			req.flash('errors', { msg: 'You must be logged in' });
			res.redirect(`/login?redirect=${req.originalUrl}`);
		},

		unAuthenticated(req, res, next) {
			if (!req.isAuthenticated())
				return next();
			res.redirect('/');
		},

		isVeryfiUserIDFacebook(req, res, next) {
			if (req.user.facebookUserID)
				return next();
			req.flash('errors', { msg: 'Bạn cần phải xác thực id facebook trước khi thực hiện hành động này' });
			res.redirect(`/verifyfbid?redirect=${req.originalUrl}`);
		},

		isWaitVerifyAccount(req, res, next) {
			if (req.session.waitVerifyAccount)
				return next();
			res.redirect('/register');
		},

		async checkHasAndInThread(req, res, next) {
			const userID = req.user.facebookUserID;
			const threadID = req.method == 'POST' ? req.body.threadID : req.params.threadID;
			const threadData = getThreadDataSync(threadID);
			if (!threadData) {
				req.flash('errors', { msg: 'Thread not found' });
				return res.redirect('/dashboard');
			}
			const findMember = threadData.members.find(m => m.userID == userID && m.inGroup == true);
			if (!findMember) {
				req.flash('errors', { msg: 'Bạn không ở trong nhóm chat này' });
				return res.redirect('/dashboard');
			}
			req.threadData = threadData;
			next();
		},

		async middlewareCheckAuthConfigDashboardOfThread(req, res, next) {
			const threadID = req.method == 'POST' ? req.body.threadID : req.params.threadID;
			if (checkAuthConfigDashboardOfThread(threadID, req.user.facebookUserID))
				return next();
			req.flash('errors', {
				msg: '[!] Chỉ quản trị viên của nhóm chat hoặc những thành viên được cho phép mới có thể chỉnh sửa dashboard'
			});
			return res.redirect('/dashboard');
		},

		async isAdmin(req, res, next) {
			const userID = req.user.facebookUserID;
			if (!global.GoatBot.config.adminBot.includes(userID)) {
				req.flash('errors', { msg: 'Bạn không phải là admin của bot' });
				return res.redirect('/dashboard');
			}
			next();
		}
	};
};