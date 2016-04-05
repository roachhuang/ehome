'use strict';

//var camera_config = require('../server/config/webcam');
var express = require('express');
var nasa = require('../controllers/nasaController');
var yahoo = require('../controllers/yahooController');
var email = require('../controllers/emailController');
var oauth2 = require('../controllers/oauth2Controller');
//console.log(gdrive.token);
var router = express.Router();

router.get('/apod', nasa.pixDaily);

// sends failure Login state back to angular
router.get('/yahoo', yahoo.weather);

router.get('/email', email.sendEmail);

// google oauth2 - redirect to url to get a code
router.get("/url", function (req, res) {
	var url = oauth2.getAuthUrl();
	res.send(url);
});

router.get('/saveimage', function () {
	console.log('saveimg is called');
});

/* Once a user has given permissions on the consent page, Google will redirect the page to the redirect URL you have provided with a code query parameter.
 ** GET /oauthcallback?code={authorizationCode}
 */
router.get('/oauthcallback', function (req, res) {
	console.log('oauth2 callback');
	var oauth2Client = oauth2.getOAuthClient();
	var code = req.query.code;
	oauth2Client.getToken(code, function (err, tokens) {
		if (err) {
			res.send(err)
		};
		oauth2Client.setCredentials(tokens);
		var accessToken = tokens.access_token
			//either save the token to a database, or send it back to the client to save.
			//CloudBalance sends it back to the client as a json web token, and the client saves the token into sessionStorage
	});
});

module.exports = router;