const bcrypt = require("bcrypt");
const expres = require("express");
const router = expres.Router();

module.exports = function ({ unAuthenticated, validateEmail, randomNumberApikey, transporter, generateEmailVerificationCode, expireVerifyCode, dashBoardData }) {
	router
		.get("/", unAuthenticated, (req, res) => {
			res.render("forgot-password");
		})
		.get("/submit-code", unAuthenticated, (req, res) => {
			if (!req.session.resetPassword)
				return res.redirect("/forgot-password");
			res.render("forgot-password-submit-code");
		})
		.get("/new-password", unAuthenticated, (req, res) => {
			if (!req.session.resetPassword)
				return res.redirect("/forgot-password");
			res.render("forgot-password-new-password");
		})

		.post("/", unAuthenticated, async (req, res) => {
			const { email } = req.body;
			if (!validateEmail(email)) {
				req.flash("errors", { msg: "Địa chỉ email không hợp lệ" });
				return res.redirect("/forgot-password");
			}
			const user = await dashBoardData.get(email);
			if (!user) {
				req.flash("errors", { msg: "Không tìm thấy email này" });
				return res.redirect("/forgot-password");
			}
			const code = randomNumberApikey(6);
			try {
				await transporter.sendMail({
					from: "Goat-Bot",
					to: email,
					subject: "Reset your password",
					html: generateEmailVerificationCode(code, "Xin chào, bạn đã yêu cầu reset mật khẩu tại Goat-Bot. Bên dưới là mã xác nhận của bạn.")
				});
			}
			catch (e) {
				req.flash("errors", { msg: "Không thể gửi email, vui lòng thử lại sau" });
				return res.redirect("/forgot-password");
			}
			req.session.resetPassword = {
				email,
				code
			};
			res.redirect("/forgot-password/submit-code");
			setTimeout((() => {
				delete req.session.resetPassword.code;
			}), expireVerifyCode);
		})
		.post("/submit-code", unAuthenticated, async (req, res) => {
			const { code } = req.body;
			const { resetPassword } = req.session;
			if (!resetPassword)
				return res.redirect("/forgot-password");
			if (code !== resetPassword.code) {
				req.flash("errors", { msg: "Mã xác nhận không chính xác" });
				return res.redirect("/forgot-password/submit-code");
			}
			res.redirect("/forgot-password/new-password");
		})
		.post("/new-password", unAuthenticated, async (req, res) => {
			if (!req.session.resetPassword)
				return res.redirect("/forgot-password");
			const email = req.session.resetPassword.email;
			const { password, password_confirmation } = req.body;
			if (password !== password_confirmation) {
				req.flash("errors", { msg: "Mật khẩu không khớp" });
				return res.redirect("/forgot-password/new-password");
			}
			if (password.length < 6) {
				req.flash("errors", { msg: "Mật khẩu phải có ít nhất 6 ký tự" });
				return res.redirect("/forgot-password/new-password");
			}
			const hashPassword = bcrypt.hashSync(password, 10);
			await dashBoardData.set(email, { password: hashPassword });
			delete req.session.resetPassword;
			req.flash("success", { msg: "Đã thay đổi mật khẩu thành công" });
			res.redirect("/login");
		});

	return router;
};