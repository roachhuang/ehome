'use strict';

//var camera_config = require('../server/config/webcam');
var express = require('express');
var passport = require('passport');

var router = express.Router();

/* Once a user has given permissions on the consent page, 
** Google will redirect the page to the redirect URL you have provided with a code query parameter.
*/
router.route('/google/callback')
	.get(passport.authenticate('google', {
		successRedirect: '/api/yahoo/',		// go to users route to render a user profile page or whatever info to users.
		failure: '/api/apod/'	// to do: erro route isn't set yet
	}));

router.route('/google')
	.get(passport.authenticate('google', {
		/* scope tells google what data u want to access */
		scope: ['https://www.googleapis.com/auth/drive.file',
				'profile']
	}));

/*
router('/signUp')
	.post(function (req, res) {
		console.log(req.body);
		// save the req.body.userName and req.body.password to database 
		// if we use database, login will become re.login(resutls.ops[0], function(){})
		// login will cal serialize and deserialize for session
		req.login(req.body, function () {
			res.redirect('/localPassport/profile');
		});
	});

		rotuer.('/profile')
			.all(function (req, res, next) {
				// if not login yet
				if (!req.user) {
					res.redirect('/');
				}
				next();
			})
			.get(function (req, res) {
				res.json(req.user);
			});

		router('signIn')
			// let passport to deal with local login
			// it creates a user obj in my session
			.post(passport.authenticate('local', {
				// if local.strategy return false
				failureRedirect: '/'
			}), function (req, res) {
				res.redirect('/localPassport/profile');
			});
*/
module.exports = router;