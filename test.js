config = require("./server/config/oauth2-config.js")
var GoogleOAuth2 = require('google-oauth2')(config);
var scope = 'https://www.googleapis.com/auth/drive'

GoogleOAuth2.getAuthCode(scope, function(err, auth_code) {
	if(err) console.error(err);
	console.log(auth_code);   
})