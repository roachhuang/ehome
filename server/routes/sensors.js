'use strict';
var express = require('express');
var router = express.Router();

module.exports = function (sensor) {
    router.route('/')
        .get(function (req, res) {
            // sensors status: true or false
            console.log('s sensors: ', sensor.detectors);
            res.json({ sensors: sensor.detectors });
        });

    router.route('/ctrlAll/:val')
        .get(function (req, res) {
            var val = req.params.val; 
            for (var i in sensor.detectors) {
                i.enable = val;
            };
        });

    router.route('/battery/:addr')
        .get(function (req, res) {
            res.json(sensor.gauges.dht.data);
        });

    return router;
};