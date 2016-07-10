'use strict';
var express = require('express');
var router = express.Router();

module.exports = function (sensors) {
    router.route('/')
        .get(function (req, res) {
            // sensors status: true or false
            res.json({ sensors: sensors });
        });

    router.route('/dht')
        .get(function (req, res) {
            res.json(gauges.dht.data);
        });

    router.route('/battery/:gauge')
        .get(function (req, res) {
            res.json({ batteryLvl: gauges[gauge].data });
        });
    return router;
};