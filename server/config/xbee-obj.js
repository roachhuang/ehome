
'use strict';

var util = require('util');
var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
var Q = require('q');
// in order to get devices object. todo: may be change to use deive router instead.
//var onOff = require('../controllers/onoff-ctrl')();

module.exports = function (sensor, devices) {
    //var routerAddr = '0013A20040EB556C';
    var xbeeAPI = new xbee_api.XBeeAPI({ api_mode: 1 });

    // ls /dev/ttyAMA0 to make suer it is exist.

    var serialport = new SerialPort('/dev/ttyAMA0', {
        //var serialport = new SerialPort('COM4', {     // this line is for testing on PC
        baudrate: 9600,
        parser: xbeeAPI.rawParser(),
        //rtscts: true
    }, function (err) {
        if (err) {
            return console.log('Error: ', err.message);
        }
    });

    // How long are we prepared to wait for a response to our command?
    var maxWait = 5000; // ms

    var initXbee = function () {
        xbeeCommand({
            type: C.FRAME_TYPE.AT_COMMAND,
            command: 'ND',
            commandParameter: [],
        }).then(function (f) {
            console.log('Command successful:', f);
        }).catch(function (e) {
            console.log('Command failed:', e);
        });

        xbeeCommand({
            type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            command: 'V+',
            remote64: '000000000000FFFF',
            // set battery threshold 0x800 * 1200/1024 = 2.4v
            commandParameter: [0x800],
        }).then(function (f) {
            console.log('Command successful:', f);
        }).catch(function (e) {
            console.log('Command failed:', e);
        });

        xbeeCommand({
            type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            command: '%V',
            remote64:'000000000000FFFF',
            // set battery threshold 0x800 * 1200/1024 = 2.4v
            commandParameter: [],
        }).then(function (f) {
            console.log('Command successful:', f);
        }).catch(function (e) {
            console.log('Command failed:', e);
        });
    };

    serialport.on('open', function () {
        console.log('port opened.');
        initXbee();
    });

    serialport.on('error', function (err) {
        console.log('Error: ', err.message);
    });

    xbeeAPI.on('frame_object', function (frame) {
        var i, v;
        console.log('outer>>' + util.inspect(frame));
        // ZigBee IO Data Sample Rx Indicator (ZNet, ZigBee)
        console.log('frame type: ', frame.type);
        switch (frame.type) {
            case 0x97: // remote AT command response
                //console.log('>>' + util.inspect(frame));
                if (frame.commandStatus === 0x00) {
                    if (frame.command === '%V') {
                        for (i in sensor.detectors) {
                            if (sensor.detectors[i].addr === frame.remote64) {
                                v = (frame.commandData[0] * 256 + frame.commandData[1]) * 1200 / 1024;
                                sensor.detectors[i].battery = v;
                                //console.info('voltage: ', v);
                                //vm.data = voltage.toFixed(2);
                            }
                        }
                    } else if (frame.command === 'IS') {
                        v = (frame.commandData[4] * 256 + frame.commandData[5]) * 1200 / 1024;
                        for (i in sensor.detectors) {
                            if (sensor.detectors[i].addr === frame.remote64) {
                                sensor.detectors[i].battery = v;
                                sensor.detectors[i].emit('batteryLow');
                            }
                        }
                    }
                }
                break;
            case 0x88:  // local AT cmd response
                /*
                >>{ type: 136,
                id: 1,
                command: 'ND',
                commandStatus: 0,
                nodeIdentification:
                { remote16: 'edee',
                remote64: '0013a20040eb556c',
                nodeIdentifier: 'r01',
                remoteParent16: 'fffe',
                deviceType: 1,
                sourceEvent: 0,
                digiProfileID: 'c105',
                digiManufacturerID: '101e' } }
                */
                if (frame.command === 'ND') {
                    var addr = frame.nodeIdentification.remote64;
                }
                break;
            case 0x92:  // IO data sample RX indicator
                /*
                { type: 146,
                remote64: '0013a20040eb556c',
                remote16: 'edee',
                receiveOptions: 1,
                digitalSamples: { DIO0: 0, DIO4: 1 },
                analogSamples: {},
                numSamples: 1 }
                */

                for (i in sensor.detectors) {
                    sensor.detectors[i].getStatus(frame);
                }
                break;
            default:
                break;
        }
    });

    function xbeeCommand(frame) {
        // set frame id
        frame.id = xbeeAPI.nextFrameId();

        // We're going to return a promise
        var deferred = Q.defer();

        var callback = function (receivedFrame) {
            if (receivedFrame.id === frame.id) {
                // This is our frame's response. Resolve the promise.
                deferred.resolve(receivedFrame);
            }
        };

        // Clear up: remove listener after the timeout and a bit, it's no longer needed
        setTimeout(function () {
            xbeeAPI.removeListener('frame_object', callback);
        }, maxWait + 1000);

        // Attach callback so we're waiting for the response
        xbeeAPI.on('frame_object', callback);

        // Pass the bytes down the serial port
        util.inspect(frame);
        serialport.write(xbeeAPI.buildFrame(frame), function (err) {
            if (err) throw (err);
        });

        // Return our promise with a timeout
        return deferred.promise.timeout(maxWait);
    }
    /*
    var atCmd = function (req, res) {
        var addr = req.params.addr, cmd = req.params.cmd, cmdParam = req.cmdParam;
        xbee.xbeeCommand({
            type: C.FRAME_TYPE.AT_COMMAND,
            command: cmd,
            commandParameter: cmdParam || []
        }).then(function (f) {
            console.log('Command successful:', f);
            return f;
        }).catch(function (e) {
            console.log('Command failed:', e);
        });
    }
    var rmtAtCmd = function (req, res) {
        var addr = req.params.addr, cmd = req.params.cmd, cmdParam = req.cmdParam;
        xbee.xbeeCommand({
            type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: this.addr,
            command: cmd,
            commandParameter: cmdParam || []
        }).then(function (f) {
            console.log('Command successful:', f);
            return f;
        }).catch(function (e) {
            console.log('Command failed:', e);
        });
    }
    */
    return {
        xbeeCommand: xbeeCommand,
        C: C
    };
};
