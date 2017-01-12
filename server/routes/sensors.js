'use strict';

const express = require('express');
var router = express.Router();

module.exports = function (xbee) {
    const sensorController = require('../controllers/sensor-ctrl')(xbee);

    // enable or disable all sensors
    router.route('/setSensorAvailability')
        //.get(sensorController.getSensorAvailability)
        .post(sensorController.post);

    router.route('/')
        .get(sensorController.getAll);

    router.route('/:index')
        .get(sensorController.get)
        .put(sensorController.put)
        .delete(sensorController.del);

    return router;
};