'use strict';
var express = require('express');

module.exports = function (sensors) {
    var router = express.Router();

    router.route('/')
        .get(function (req, res) {
            // sensors status: true or false
            res.json({ sensors: sensors });
        });

    return router;
};