'use strict';

//var camera_config = require('../server/config/webcam');
var express = require('express');
var nasa = require('../config/nasa');
var yahoo = require('../config/yahoo');
var email = require('../config/email.js');

var router = express.Router();

router.get('/apod', nasa.pixDaily);

// sends failure Login state back to angular
router.get('/yahoo', yahoo.weather);

router.get('/email', email.sendEmail);

module.exports = router;