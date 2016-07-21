'use strict';
var express = require('express');
var router = express.Router();

module.exports = function (sensor) {
    router.route('/')
        .get(function (req, res) {
            // sensors status: true or false
            res.json({ sensors: sensor.detectors });
        });

    router.route('/dht')
        .get(function (req, res) {
            res.json(sensor.gauges.dht.data);
        });

    router.route('/battery/:addr')
        .get(function (req, res) {
            var addr = req.params.addr;
            res.json({ batteryLvl: sensor.gauges.battery.data });
        });
    return router;
};