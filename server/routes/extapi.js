'use strict';

//var camera_config = require('../server/config/webcam');
var express = require('express');
var nasa = require('../controllers/nasaController');
var yahoo = require('../controllers/yahooController');
//var email = require('../controllers/emailController')();

var router = express.Router();
/*
var fs = require('fs');
router.all('*', function (req, res, next) {

    fs.readFile('token.json', function (err, token) {
        if (err) {
            res.redirect('http://localhost:3000/auth/google/');
        } else {
            token = token.toString();
            next();
        }
    });
})
*/

router.route('/apod')
    .get(nasa.pixDaily);

// sends failure Login state back to angular
router.route('/yahoo')
    .get(yahoo.weather);

//todo: no route for email is requried. remove it later.
//router.get('/email', email.sendEmail);
/* todo: fix path bug
router('/saveimage', function () {
	console.log('saveimg is called');
});
*/
module.exports = router;