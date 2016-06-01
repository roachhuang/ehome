'use strict';
var express = require('express');
//var _ = require('loadash');
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
    //.set(cronCtrl.set)
    .post(cronCtrl.post)
    .get(cronCtrl.get)
/*
router.use('/:id', function(req, res, next){
    var id = req.params.id
    if (id > 5)
        res.status(404).send('max id is 5');
    else
        req.cron = cron;
});
*/

router.route('/:id')
    .get(cronCtrl.getById)
    .put(cronCtrl.put)
    .delete(cronCtrl.delete)

module.exports = router;