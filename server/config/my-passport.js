var passport = require('passport');

module.exports = function (app, config) {
	/* authen */
	app.use(passport.initialize());
	app.use(passport.session());

	/* bundle our user up into the session and pull the user back out of the seesion */
	passport.serializeUser(function (user, done) {
		// call back func
		done(null, user);
	});
	// pull user back from session
	passport.deserializeUser(function (user, done) {
		// may be read user data from database
		// user.findById(userId);	 // if there is a database
		done(null, user);
	});

	//require('./strtegies/local.strategy')();
	require('./strategies/google.strategy')(passport, config);
};