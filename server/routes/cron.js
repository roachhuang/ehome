'use strict';
var express = require('express');
//var _ = require('loadash');
var router = express.Router();

// boday-parser is included in app.js, so no need to do it here.
// it is alreay apply to express

//var bodyParser = require('body-parser');
//var app = express();

// create application/json parser
//var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false })
module.exports = function (xbee) {
    var cronCtrl = require('../controllers/cron-ctrl')(xbee);
    router.route('/addr')
        .post(cronCtrl.post)
        .delete(cronCtrl.deleteAll)
        .get(cronCtrl.get);
    /*
    router.use('/:id', function(req, res, next){
        var id = req.params.id
        if (id > 5)
            res.status(404).send('max id is 5');
        else
            req.cron = cron;
    });
    */    

    router.route('/:pin')
    router.route('/:id')
        .delete(cronCtrl.deleteById);

    return router;
};