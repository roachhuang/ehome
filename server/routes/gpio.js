'use strict';
const express = require('express');
var router = express.Router();

// gpiocontroller is a func; in order to have it returns an object back to us, we need to execute it by following "()"
module.exports = function (xbee) {
    const gpioController = require('../controllers/onoff-ctrl')(xbee);

    //var gpioController = require('../controllers/rpi-gpio-ctrl')();
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

    // get devices
    router.route('/')
        .get(gpioController.getXbee);

    router.route('/:index')
        .put(gpioController.updateDevice)
        .delete(gpioController.delDevice);

    // type: sensor or power socket
    router.route('/pair/:id/:type')
        .get(gpioController.pair);

    router.route('/io/:pin/:addr')
        .get(gpioController.get)   // return 0 or 1
        .post(gpioController.post);

    router.route('/rmtAtCmd/:addr/:cmd/:cmdParam')
        .get(gpioController.rmtAtCmd);

    router.route('/atCmd/:cmd/:cmdParam')
        .get(gpioController.atCmd);

    return router;
};

