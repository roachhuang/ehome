'use strict';
var express = require('express');
//var _ = require('loadash');


// boday-parser is included in app.js, so no need to do it here.
// it is alreay apply to express

//var bodyParser = require('body-parser');
//var app = express();

// create application/json parser
//var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false })
var routes = function (xbee) {
    var cronRouter = express.Router();
    var cronCtrl = require('../controllers/cron-ctrl')(xbee);
    // consider the addr as the device id.
    cronRouter.route('/:addr')
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
    cronRouter.route('/byId/:id')
        //.get(cronCtrl.get)
        .delete(cronCtrl.deleteById);

    return cronRouter;
};
module.exports=routes;