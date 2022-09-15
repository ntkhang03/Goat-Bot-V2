const expres = require('express');
const router = expres.Router();

module.exports = function ({ unAuthenticated_G, unAuthenticated_P, isVerifyRecaptcha, Passport }) {
	router
		.get("/", unAuthenticated_G, (req, res) => {
			req.session.redirectTo = req.query.redirect || '/';
			res.render('login');
		})
		.post("/", unAuthenticated_P, async (req, res, next) => {
			if (!await isVerifyRecaptcha(req.body['g-recaptcha-response']))
				return res.status(400).send({
					status: "error",
					errors: [{ msg: "Captcha không hợp lệ" }]
				});
			Passport.authenticate('local', function (err, user, info) {
				if (err)
					return next(err);
				if (!user) {
					return res.status(400).send({
						status: "error",
						errors: [{ msg: info.message }]
					});
				}
				const redirectLink = req.session.redirectTo || '/';
				req.login(user, function (err) {
					if (err)
						return next(err);
					res.send({
						redirectLink
					});
				});

			})(req, res, next);
		});

	return router;
};