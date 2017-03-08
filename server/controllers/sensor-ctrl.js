'use strict';
const _ = require('lodash');

module.exports = function (xbee) {

    var post = function (req, res) {
        // enable or disable a certain sensor
        var srcSensors = req.body.sensors;
        for (var i = 0; i < srcSensors.length; i++) {
            xbee.sensors[i].enable = srcSensors[i].enable;
        }
        res.status(200).send('ok');
    };
    /*
        function getSensorAvailablilty(req, res) {
            var val = req.params.val;
            for (var i in xbee.sensors) {
                if (xbee.sensors.hasOwnProperty(i)) {
                    i.enable = val;
                }
            }
            res.sendStatus(200);
        };
    */
    var getAll = function (req, res) {
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
    };

    var get = function (req, res) {
        let index = parseInt(req.params.index);
        res.send(xbee.sensors[index]);
    };

    var put = function (req, res) {
        //console.log('put: ', req.body);
        let newName = 's'.concat(req.body.name);
        let index = parseInt(req.params.index);
        xbee.sensors[index].name = newName;
        // Sequencing Asynchronous Operations
        xbee.rmtAtCmd(xbee.sensors[index].addr, 'NI', newName).then(function (result1) {
            console.log(result1);
            return xbee.rmtAtCmd(xbee.devices[index].addr, 'WR');
        }).then(function (result2) {
            console.log(result2);
            res.sendStatus(200);
        }).catch(function (err) {
            res.status(500).send(err);
        });
    };

    var del = function (req, res) {
        let index = parseInt(req.params.index);
        let xbeeName = xbee.sensors[index].name;
        xbee.rmtAtCmd(xbee.sensors[index].addr, 'NI', 'null').then(function (result1) {
            return xbee.rmtAtCmd(xbee.sensors[index].addr, 'WR')
        }).then(function () {
            _.remove(xbee.sensors, function (sensor) {
                return sensor.name === xbeeName;
            });
            res.status(200).send('deleted');
        }).catch(function (err) {
            res.status(500).send(err);
        });
    };

    return {
        get: get,
        post: post,
        put: put,
        del: del,
        getAll: getAll
    };
};