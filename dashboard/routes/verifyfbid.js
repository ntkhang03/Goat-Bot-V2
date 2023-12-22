const express = require("express");
const router = express.Router();
const { findUid, getText } = global.utils;

module.exports = function ({ isAuthenticated, randomNumberApikey, expireVerifyCode, isVerifyRecaptcha, dashBoardData, api, createLimiter, config }) {
	router
		.get("/", isAuthenticated, (req, res) => {
			req.session.redirectTo = req.query.redirect;
			res.render("verifyfbid");
		})
		.get("/submit-code", [isAuthenticated, function (req, res, next) {
			if (!req.session.waitVerify)
				return res.redirect("/verifyfbid");
			next();
		}], (req, res) => {
			res.render("verifyfbid-submit-code");
		})

		.post("/", isAuthenticated, async (req, res) => {
			if (!await isVerifyRecaptcha(req.body["g-recaptcha-response"]))
				return res.status(400).json({ errors: [{ msg: "Recaptcha is not correct" }] });
			if (!api)
				return res.status(400).send({ errors: [{ msg: "Hiện tại bot không hoạt động, vui lòng quay lại sau" }] });
			let { fbid } = req.body;
			const code = randomNumberApikey(6);
			if (!fbid)
				return res.status(400).send({ errors: [{ msg: "Vui lòng nhập facebook id" }] });
			try {
				if (isNaN(fbid))
					fbid = await findUid(fbid);
			}
			catch (e) {
				return res.status(400).send({ errors: [{ msg: "Facebook id hoặc url profile không tồn tại" }] });
			}
			req.session.waitVerify = {
				fbid,
				code,
				email: req.user.email
			};

			setTimeout(() => {
				delete req.session.waitVerify;
			}, expireVerifyCode);

			try {
				await api.sendMessage(getText("verifyfbid", "sendCode", code, config.dashBoard.expireVerifyCode / 60000, global.GoatBot.config.language), fbid);
			}
			catch (e) {
				const errors = [];
				if (e.blockedAction)
					errors.push({ msg: "Hiện tại bot bị chặn tính năng và không thể gửi tin nhắn, vui lòng thử lại sau" });
				else
					errors.push({ msg: `Không thể gửi mã xác nhận tới id facebook "${fbid}", bạn đã bật nhận tin nhắn chờ từ người lạ chưa?` });

				req.flash("errors", errors);
				return res.status(400).send({
					status: "error",
					errors,
					message: errors[0].msg
				});
			}
			req.flash("success", { msg: "Mã xác nhận đã được gửi tới id facebook của bạn, nếu không thấy hãy kiểm tra tin nhăn chờ" });
			res.send({
				status: "success",
				message: "Mã xác nhận đã được gửi tới id facebook của bạn, nếu không thấy hãy kiểm tra tin nhăn chờ"
			});
		})
		.post("/submit-code", [isAuthenticated, function (req, res, next) {
			if (!req.session.waitVerify)
				return res.redirect("/verifyfbid");
			next();
		}, createLimiter(1000 * 60 * 5, 20)], async (req, res) => {
			const { code } = req.body;
			const user = await dashBoardData.get(req.user.email);
			if (code == req.session.waitVerify.code) {
				const fbid = req.session.waitVerify.fbid;
				console.log(`User ${user.email} verify fbid ${fbid}`);
				delete req.session.waitVerify;
				await dashBoardData.set(user.email, { facebookUserID: fbid });
				req.flash("success", { msg: "Đã xác nhận user id facebook thành công" });
				res.send({
					status: "success",
					message: "Đã xác nhận user id facebook thành công",
					redirectLink: req.session.redirectTo || "/dashboard"
				});
			}
			else {
				return res.status(400).send({ msg: "Mã xác nhận không đúng" });
			}
		});

	return router;
};