'use strict';

//var camera_config = require('../server/config/webcam');
var express = require('express');
var nasa = require('../controllers/nasaController');
var yahoo = require('../controllers/yahooController');
var email = require('../controllers/emailController');

//console.log(gdrive.token);
var router = express.Router();

router.get('/apod', nasa.pixDaily);

// sends failure Login state back to angular
router.get('/yahoo', yahoo.weather);

router.get('/email', email.sendEmail);

router.get('/saveimage', function () {
	console.log('saveimg is called');
});

module.exports = router;