module.exports = function (getThreadDataSync, checkAuthConfigDashboardOfThread) {
	return {
		isAuthenticated(req, res, next) {
			if (req.isAuthenticated())
				return next();
			res.status(401).send({
				status: "error",
				error: 'PERMISSION_DENIED',
				message: 'Bạn chưa đăng nhập'
			});
		},

		unAuthenticated(req, res, next) {
			if (!req.isAuthenticated())
				return next();
			res.status(401).send({
				status: "error",
				error: 'PERMISSION_DENIED',
				message: 'Đã xảy ra lỗi'
			});
		},

		isVeryfiUserIDFacebook(req, res, next) {
			if (req.user.facebookUserID)
				return next();
			res.status(401).send({
				status: "error",
				error: 'PERMISSION_DENIED',
				message: 'Bạn chưa xác thực id Facebook'
			});
		},

		isWaitVerifyAccount(req, res, next) {
			if (req.session.waitVerifyAccount)
				return next();
			res.status(401).send({
				status: "error",
				error: 'PERMISSION_DENIED',
				message: 'Đã xảy ra lỗi, vui lòng thử lại'
			});
		},

		async checkHasAndInThread(req, res, next) {
			const userID = req.user.facebookUserID;
			const { threadID } = req.body;
			const threadData = getThreadDataSync(threadID);
			if (!threadData)
				return res.status(401).send({
					status: "error",
					error: 'PERMISSION_DENIED',
					message: 'Không tìm thấy nhóm này'
				});
			const findMember = threadData.members.find(m => m.userID == userID && m.inGroup == true);
			if (!findMember)
				return res.status(401).send({
					status: "error",
					error: 'PERMISSION_DENIED',
					message: 'Bạn không phải là thành viên nhóm này'
				});
			req.threadData = threadData;
			next();
		},

		async middlewareCheckAuthConfigDashboardOfThread(req, res, next) {
			const threadID = req.body.threadID;
			if (checkAuthConfigDashboardOfThread(threadID, req.user.facebookUserID))
				return next();
			res.status(401).send({
				status: "error",
				error: 'PERMISSION_DENIED',
				message: 'Bạn không có quyền chinh sửa nhóm này'
			});
		}
	};
};