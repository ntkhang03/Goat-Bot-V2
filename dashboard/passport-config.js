const localStrategy = require('passport-local').Strategy;

module.exports = function (Passport, db, bcrypt) {
	Passport.serializeUser((user, done) => {
		done(null, user.email);
	});

	Passport.deserializeUser(async (email, done) => {
		const user = await db.get(email);
		done(null, user);
	});

	Passport.use(new localStrategy(
		async function (email, password, done) {
			const user = db.get(email);
			if (!user)
				return done(null, false, { message: "Email không tồn tại" });

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch)
				return done(null, false, { message: "Địa chỉ email hoặc mật khẩu không đúng" });

			return done(null, user);
		}
	));
};