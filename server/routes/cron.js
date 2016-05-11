'use strict';
var express = require('express');
var router = express.Router();

var cronCtrl = require('../controllers/cron-ctrl')();
// boday-parser is included in app.js, so no need to do it here.
// it is alreay apply to express

//var bodyParser = require('body-parser');
//var app = express();

// create application/json parser
//var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.route('/')
    .post(cronCtrl.set);

module.exports = router;