'use strict';
var express = require('express');
var router = express.Router();
var sensorsCtrl = require('../controllers/sensors-ctrl')();

router.route('/:sensor')
    .get(sensorsCtrl.get)

module.exports = router;
