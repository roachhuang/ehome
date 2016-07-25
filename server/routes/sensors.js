'use strict';
var express = require('express');
var router = express.Router();

module.exports = function (sensor) {
    router.route('/')
        .get(function (req, res) {
            // sensors status: true or false
            res.json({ sensors: sensor.detectors });
        });

    router.route('/battery/:addr')
        .get(function (req, res) {
            res.json(sensor.gauges.dht.data);
        });

    return router;
};