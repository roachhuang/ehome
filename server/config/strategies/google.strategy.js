// var passport = require('passport');
var GoolgeStrategy = require('passport-google-oauth').OAuth2Strategy;
//var GoolgeStrategy = require('passport-google-drive').Strategy;
module.exports = function (passport, config) {
    // plug in google strategy into passport so we can use it
    passport.use(new GoolgeStrategy({
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL},
        function(req, accessToken, refreshToken, done) {
            var user = {};
            //user.email = profile.emails[0].value;
            //user.image = profile._json.image.url;
            //user.displayName = profile.displayName;
            
            user.google = {};
            //user.google.id = profile.id;
            //either save the token to a database, or send it back to the client to save.
			//CloudBalance sends it back to the client as a json web token, 
			//and the client saves the token into sessionStorage
            user.google.token = accessToken;
            
            // get data from google
            done(null, user);  
        }
    ));
};