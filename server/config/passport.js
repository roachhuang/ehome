var passport = require('passport');

modules.exports = function(app) {
	/* authen */	
	app.use(passport.initialize());
	app.use(passport.session());
	
	/* bundle our user up into the session and pull the user back out of the seesion */
	passport.serializeUser(function(user, done){
		done(null, user);
	});
	passport.deserializeUser(function(user, done){
		// may be read user data from database
		done(null, user);
	});
	
	require('./strtegies/local.strategy')();
	
}