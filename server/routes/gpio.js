
'use strict';
var express = require('express');
var router = express.Router();

// gpiocontroller is a func; in order to have it returns an object back to us, we need to execute it by following "()"

var gpioController = require('../controllers/onoff-ctrl')();
//var gpioController = require('../controllers/gpio-ctrl')();
/* boday-parser is included in app.js, so no need to do it here.
* it is alreay apply to express
* create application/x-www-form-urlencoded parser
*  var urlencodedParser = bodyParser.urlencoded({ extended: false })
*/
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

router.route('/:pin')
    .get(gpioController.get)   // return 0 or 1
    .post(gpioController.post);

router.route('/getGpioObj/:pin')
    .get(gpioController.getGpioObj);

module.exports = router;
