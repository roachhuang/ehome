'use strict';
var express = require('express');
var router = express.Router();

// gpiocontroller is a func; in order to have it returns an object back to us, we need to execute it by following "()"

//var gpioController = require('../controllers/onoff-ctrl')();
var gpioController = require('../controllers/gpio-ctrl')();
/* boday-parser is included in app.js, so no need to do it here.
* it is alreay apply to express
* create application/x-www-form-urlencoded parser
*  var urlencodedParser = bodyParser.urlencoded({ extended: false })
*/

router.route('/:pin')
    .get(gpioController.get);
    .post(gpioController.post);

    module.exports = router;
