const path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
	development: {
		env: 'development',
		db: '',
		rootPath: rootPath,
		port: process.env.PORT || 3000,
		// clientId: '899860195119-vtv54rldfqcisk2c9mcqcv6um9jppacf.apps.googleusercontent.com',
		// clientSecret: '3mcYjSf-XBPy4ZB9KPffNTzP',
		clientId: '141123056897-q2d7jtq5h3q86jj5f9v3g341h3qgqtpf.apps.googleusercontent.com',
		clientSecret: 'Q_y6wkKnlP1oDgF--szw80dt',
		//callbackURL: 'http://localhost:3000/auth/google/callback',
		callbackURL: 'http://ubuy.asuscomm.com:3000/auth/google/callback',
		textMagic: {
			key: 'g4sxO6FrzpOordGvKJNVcgjX45f0sy',
			appName: 'ehome',
			username: 'markhuang'
		}
	},
	build: {
		env: 'build',
		db: '',
		rootPath: rootPath,
		//port: process.env.PORT || 80,
		port: 80,
		clientId: '141123056897-q2d7jtq5h3q86jj5f9v3g341h3qgqtpf.apps.googleusercontent.com',
		clientSecret: 'Q_y6wkKnlP1oDgF--szw80dt',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	}
};