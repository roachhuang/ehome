
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

    serialport.on('open', function () {
        console.log('port opened.');
        atCmd('ND', []);
        // read router's battery level every 2 hrs
        for (var i in sensor.gauges.battery) {
            setInterval(rmtAtCmd('%V', [], sensor.gauges.battery.addr), 2 * 60 * 60 * 1000);
        }
        //Read information regarding last node join request
        rmtAtCmd('AI', [], '000000000000FFFF');
        rmtAtCmd('JV', [0x01], '000000000000FFFF');     
    });

    serialport.on('error', function (err) {
        console.log('Error: ', err.message);
    });

    xbeeAPI.on("frame_object", function (frame) {
        console.log('>>' + util.inspect(frame));
        // ZigBee IO Data Sample Rx Indicator (ZNet, ZigBee)
        console.log('frame type: ', frame.type);
        switch (frame.type) {
            case 0x97: // remote AT command response
                //console.log('>>' + util.inspect(frame));
                if (frame.commandStatus === 0x00 && frame.command === '%V') {
                    for (var i in sensor.gauges.battery) {
                        if (sensor.gauges.battery[i].addr === frame.remote64) {
                            sensor.gauges.battery[i].getBatteryLvl(frame);
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
    };
 
function xbeeCommand(frame) {
    // set frame id
    frame.id = xbeeAPI.nextFrameId();

    // We're going to return a promise
    var deferred = Q.defer();

    var callback = function(receivedFrame) {
        if (receivedFrame.id == frame.id) {
            // This is our frame's response. Resolve the promise.
            deferred.resolve(receivedFrame);
        }
    };

    // Clear up: remove listener after the timeout and a bit, it's no longer needed
    setTimeout(function() {
        xbeeAPI.removeListener("frame_object", callback);
    }, maxWait + 1000);
    
    // Attach callback so we're waiting for the response
    xbeeAPI.on("frame_object", callback);

    // Pass the bytes down the serial port
    serialport.write(xbeeAPI.buildFrame(frame), function(err){
        if (err) throw(err);
    });

    // Return our promise with a timeout
    return deferred.promise.timeout(maxWait);
}
    return {
        xbeeCommand: xbeeCommand,
        C: C
    };
};
