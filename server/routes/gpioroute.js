var express = require('express');
var gpioController = require('../controllers/gpioController')(null);

var gpioRouter = express.Router();
// make suer user has to sign in before using gpio function
gipoRouter.use(gpioController.middle);
	