'use strict';
var _ = require('lodash');
var express = require('express');
var router = express.Router();

module.exports = function (xbee) {
    router.route('/')
        .get(function (req, res) {
            // sensors status: true or false
            console.log('s sensors: ', xbee.sensors);
            // 
            res.json({ sensors: xbee.sensors });
        })
        .post(function (req, res) {
            // enable or disable a certain sensor
            var srcSensors = req.body.sensors;
            for (var i = 0; i < srcSensors.length; i++) {
                xbee.sensors[i].enable = srcSensors[i].enable;
            }
            res.sendStatus(200);
        });

    router.route('/:index')
        .put(function (req, res) {
            console.log('put: ', req.body);
            _.merge(xbee.sensors[req.params.index], req.body);
            //res.sendStatus(200);
            res.status(200).send({ info: 'sensor name updated successfully' });
        });

    /* update 
     router.route('/:id')
        .put(function (req, res) {       
            var index = _.findIndex(
                xbee.sensors,
                {
                    name: req.params.id
                }
            );
            _merge(xbee.sensors[index], req.body); 
            //res.sendStatus(200);
            res.json({info: 'sensor name updated successfully'});
        });
*/

    // enable or disable all sensors
    router.route('/ctrlAll/:val')
        .get(function (req, res) {
            var val = req.params.val;
            for (var i in xbee.sensors) {
                if (xbee.sensor.hasOwnProperty(i)) {
                    i.enable = val;
                }
            }
            res.sendStatus(200);
        });

    return router;
};