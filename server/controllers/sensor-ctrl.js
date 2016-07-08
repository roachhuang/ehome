'use strict';
var email = require('./emailController');
var util = require('util');
// test purpose
//var twilio = require('./sms-ctrl')();

// init xbee - setup baud rate, com port,  mode, etc.
//var xbee = require('../config/xbee-obj')();

// sensor object is passed in from app.js

module.exports = function (sensors, xbee) {

    xbee.serialport.on('open', function () {
        console.log('port opened.');
        // read router's battery level
        xbee.rmtAtCmd('%V', [], xbee.routerAddr);
        /*
        var frame_obj = { // AT Request to be sent to
            type: xbee.C.FRAME_TYPE.AT_COMMAND,
            destination64: '0013A20040EB556C',
            command: 'NI',
            commandParameter: [],
        };
        xbee.serialport.write(xbee.API.buildFrame(frame_obj), function(error) {
            console.log('sendframe: ' + error);
        });
    });
    */
    });

    xbee.serialport.on('data', function (data) {
        console.log('data received: ' + data);
    });

    xbee.serialport.on('error', function (err) {
        console.log('Error: ', err.message);
    });

    // All frames parsed by the XBee will be emitted here
    xbee.API.on('frame_object', function (frame) {
        //console.log('>>' + util.inspect(frame));
        // ZigBee IO Data Sample Rx Indicator (ZNet, ZigBee)
        console.log('frame type: ', frame.type);
        switch (frame.type) {
            case 0x97: // remote AT command response
                console.log('>>' + util.inspect(frame));
                if (frame.commandStatus === 0x00 && frame.command === '%V') {
                    var voltage = (frame.commandData[0] * 256 + frame.commandData[1]) / 1024;
                    //console.info('voltage: ', voltage);
                    sensors.xbeeRouter.status = voltage.toString() + 'V';
                }
                break;
            case 0x88:  // local AT cmd response
                break;
            case 0x92:  // IO data sample RX indicator
                sensors.window.getStatus(frame);
                break;
            default:
                break;
        }
    });

    sensors.window.on('open', function () {
        //if (alarm.state === 'on') {
        // turn on spot light
        // activate alarm
        // there should be a limit of sending email and txt msg.
        //email.sendEmail();
        // send text msg
        //twilio.sendMessage();
        //twilio.makeCall();
        // start recording video or capture video image 10 times (one time per sec)
        // 7-eleven call police
        // alert.window = true;
        //} else {
        //lights.switchOn();
        //voice.speak('Welcome home');
        // }
    });

    /*
       door.on('open', function () {
           if (alarm.state === 'on') {
               alarm.sound();
               hounds.release();
           } else {
               lights.switchOn();
               voice.speak('Welcome home');
           }
       });
   */
};