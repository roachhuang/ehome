'use strict';
var express = require('express');
var router = express.Router();

<<<<<<< HEAD
// gpiocontroller is a func; in order to have it returns an object back to us, we need to execute it by following "()"
var gpioController = require('../controllers/gpio-controller')();
=======
// gpiocontroller is a func; in order to have it returns an object back to us, we need to execute it by following "()" 
var gpioController = require('../controllers/onff-ctrl')();
>>>>>>> bc92548e6bf64d09827d9d04f82841f1e1461df4
// boday-parser is included in app.js, so no need to do it here.
// it is alreay apply to express

//var bodyParser = require('body-parser');
//var app = express();

// create application/json parser
//var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.route('/:pin')
<<<<<<< HEAD
    .get(gpioController.get)
    .post(gpioController.put);
=======
    .get(gpioController.get)  
    .post(gpioController.post);
>>>>>>> bc92548e6bf64d09827d9d04f82841f1e1461df4

module.exports = router;