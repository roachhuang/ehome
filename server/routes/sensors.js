'use strict';
var express = require('express');

module.exports = function (sensors) {
    var router = express.Router();

    router.route('/')
        .get(function (req, res) {
            res.status(200).json({ sensors: sensors });
        });

    return router;
};