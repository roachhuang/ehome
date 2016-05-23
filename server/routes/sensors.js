'use strict';
var express = require('express');

module.exports = function (sensors) {
    var router = express.Router();

    router.route('/')
        .get(function (req, res) {
            res.json(200, { sensors: sensors });
        });

    return router;
};
