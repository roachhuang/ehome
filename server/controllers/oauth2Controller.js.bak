//var oauth2 = require('../config/oauth2');
var google = require('googleapis');

//var oauth2Client = new OAuth2("904913092085-bi817n9vani5f92tmrf3992f5sa4964a.apps.googleusercontent.com", "nLLu5FYp-1ikw_Q8PN7XYxU7", "http://localhost:3000/oauthcallback");
function Oauth2() {
	var OAuth2 = google.auth.OAuth2;
	const ClientId = "904913092085-bi817n9vani5f92tmrf3992f5sa4964a.apps.googleusercontent.com";
	const ClientSecret = "nLLu5FYp-1ikw_Q8PN7XYxU7";
	const RedirectionUrl = "http://localhost:3000/api/oauthcallback";
	this.getOAuthClient = function() {
		return new OAuth2(ClientId, ClientSecret, RedirectionUrl);
	}

	this.getAuthUrl = function() {
		var oauth2Client = this.getOAuthClient();
		// generate a url that asks permissions for Google+ and Google Calendar scopes
		var scopes = [
			'https://www.googleapis.com/auth/drive.file'
		];

		var url = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: scopes // If you only need one scope you can pass it as string
		});
		return url;
	}
};
module.exports = new Oauth2();

function getFile(token, fileId, callback) {
	googleDrive(token).files(fileId).get(cb)
}

function cb(err, response, body) {
	if (err) return console.log('err')

	console.log('response', response)
	console.log('body', JSON.parse(body))
}