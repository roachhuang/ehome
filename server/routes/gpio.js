'use strict';
var express = require('express');
var router = express.Router();

// gpiocontroller is a func; in order to have it returns an object back to us, we need to execute it by following "()" 
var gpioController = require('../controllers/gpio-controller')();

// boday-parser is included in app.js, so no need to do it here.
// it is alreay apply to express

//var bodyParser = require('body-parser');
//var app = express();

// create application/json parser
//var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.route('/:pin')
    .get(gpioController.get)  
    .post(gpioController.post);

module.exports = router;