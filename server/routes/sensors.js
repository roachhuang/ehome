'use strict';
var express = require('express');
var router = express.Router();

module.exports = function (sensors) {
    router.route('/')
        .get(function (req, res) {
            // sensors status: true or false
            res.json({ sensors: sensors.detectors });
        });

    router.route('/dht')
        .get(function (req, res) {
            res.json(sensors.gauges.dht.data);
        });

    router.route('/battery/:remote16')        
        .get(function (req, res) {
            var remote16 = req.params.remote16
            res.json({ batteryLvl: sensors.gauges[remote16].data });
        });
    return router;
};