const localStrategy = require('passport-local').Strategy;

module.exports = function (Passport, db, bcrypt) {
	Passport.serializeUser((user, done) => {
		done(null, user.email);
	});

	Passport.deserializeUser(async (email, done) => {
		const user = await db.get(email);
		done(null, user);
	});

	Passport.use(new localStrategy({
		usernameField: "username",
		passwordField: "password",
		passReqToCallback: true
	}, async function (req, email, password, done) {
		const user = await db.get(email);
		if (!user)
			return done(null, false, { message: "Email không tồn tại" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return done(null, false, { message: "Địa chỉ email hoặc mật khẩu không đúng" });

		const remeber = req.body.remeber;
		if (remeber)
			req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
		else
			req.session.cookie.expires = false;

		return done(null, user);
	}));
};