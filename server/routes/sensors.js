'use strict';
const _ = require('lodash');
const express = require('express');
var router = express.Router();

module.exports = function (xbee) {
    router.route('/')
        .get(function (req, res) {
            // sensors status: true or false
            //console.log('s sensors: ', xbee.sensors[0].battery);
            // refresh devices status by sending ND commmand (in case if a device is truned off);
            //xbee.atCmd('ND');
            // todo: move read battery value to a place earlier than returning sensors obj
            for (var i = 0; i < xbee.sensors.length; i++) {
                // this is weird that when in then {}, i becomes i instead of 0.
                var j = i;
                xbee.xbeeCmd({ type: xbee.C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST, destination64: xbee.sensors[i].addr, command: '%V', commandParameter: [] }).then(function (f) {
                    var b = f.commandData[0] * 256 + f.commandData[1];
                    xbee.sensors[j].battery = (b / 1000).toFixed(2);
                    console.log(xbee.sensors[j].battery);
                });
            }
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

    router.route('/:name')
        .get(function (req, res) {
            res.send(
                _.find(
                    xbee.sensors,
                    {
                        name: req.params.name
                    }
                )
            );
        })
        .put(function (req, res) {
            console.log('put: ', req.body);
            let index = _.findIndex(xbee.sensors, { name: req.params.name });
            _.merge(xbee.sensors[index], req.body);
            //res.sendStatus(200);
            res.status(200).send({ info: 'sensor name updated successfully' });
        })
        .delete(function (req, res) {
            _.remove(xbee.sensors, function (sensor) {
                return sensor.name === req.params.name;
            });
            res.json({ info: 'sensor removed successfully' });
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
                if (xbee.sensors.hasOwnProperty(i)) {
                    i.enable = val;
                }
            }
            res.sendStatus(200);
        });

    return router;
};