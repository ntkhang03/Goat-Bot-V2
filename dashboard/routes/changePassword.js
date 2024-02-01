const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

module.exports = function ({ isAuthenticated, isVerifyRecaptcha, dashBoardData }) {
	router
		.get("/", isAuthenticated, async (req, res) => {
			res.render("change-password");
		})
		.post("/", isAuthenticated, async (req, res) => {
			if (!await isVerifyRecaptcha(req.body["g-recaptcha-response"]))
				return res.status(400).json({
					status: "error",
					error: "CAPTCHA IS NOT VERIFIED",
					message: "Captcha không hợp lệ"
				});
			const { oldassword, password, password_confirmation } = req.body;
			if (!await bcrypt.compare(oldassword, req.user.password))
				return res.status(400).json({
					status: "error",
					error: "OLDASSWORD_IS_NOT_CORRECT",
					message: "Mật khẩu cũ không đúng"
				});
			if (password !== password_confirmation)
				return res.status(400).json({
					status: "error",
					error: "PASSWORD_IS_NOT_MATCH",
					message: "Mật khẩu không khớp"
				});
			if (password.length < 6)
				return res.status(400).json({
					status: "error",
					error: "PASSWORD_IS_NOT_ENOUGH",
					message: "Mật khẩu phải có ít nhất 6 ký tự"
				});

			const hashPassword = bcrypt.hashSync(password, 10);
			await dashBoardData.set(req.user.email, { password: hashPassword });
			req.flash("success", {
				msg: "Đã thay đổi mật khẩu thành công"
			});
			res.send();
		});

	return router;
};