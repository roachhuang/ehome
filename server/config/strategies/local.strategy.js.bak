var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function () {
	// handle local sigin. The usernameField must be in accord with our singin form
	passport.use(new LocalStrategy({
		usernameField: 'userName',
		passwordField: 'password'
	}, function (username, password, done) {
		var user = {
			username: username,
			password: password
		};
		// here we validate user login
		/* if(results.password === password){
				var user = results;
				done(null, user);
			} else{
				done(null,  false, {message: 'invalid password'});
			}
		}*/
		done(null, user);
	}));
};