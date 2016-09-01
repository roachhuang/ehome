'use strict';
var express = require('express');
var router = express.Router();

module.exports = function (sensor) {
    router.route('/')
        .get(function (req, res) {
            // sensors status: true or false
            console.log('s sensors: ', sensor.detectors);
            res.json({ sensors: sensor.detectors });
        })
        .post(function (req, res) {
            var sensors = req.body.sensors;
            for (var i = 0; i < sensors.length; i++) {
                sensor.detectors[i].enable = sensors[i].enable;
            }
            res.sendStatus(200);
        });
    
    // enable or disable all sensors
    router.route('/ctrlAll/:val')
        .get(function (req, res) {
            var val = req.params.val;
            for (var i in sensor.detectors) {
                if (sensor.detectors.hasOwnProperty(i)) {
                    i.enable = val;
                }
            }
            res.sendStatus(200);
        }); 

    return router;
};