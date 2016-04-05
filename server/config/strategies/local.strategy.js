var passport = require('passport')
	, localStrategy = require('passport-local').Strategy;

module.exports = function () {
	// handle local sigin. The usernameField must be in accord with our singin form
	passport.use(new localStrategy({
			usernameField: 'userName'
			, passwordField: 'password'
		}
		, function (usernmae, password, done) {
			var user = {
				username: username
				, password: password
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
}