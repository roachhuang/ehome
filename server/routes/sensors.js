'use strict';
var express = require('express');
var router = express.Router();

module.exports = function (sensors) {
    router.route('/')
        .get(function (req, res) {
            // sensors status: true or false
            //console.log('call get sensors');
            res.json({ sensors: sensors });            
        });

    return router;
};