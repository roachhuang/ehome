'use strict';
var email = require('./emailController');
// test purpose
//var twilio = require('./sms-ctrl')();

// init xbee - setup baud rate, com port,  mode, etc.
//var xbee = require('../config/xbee-obj')();

// sensor object is passed in from app.js

module.exports = function (sensors, xbee) {

    xbee.serialport.on('open', function () {
        console.log('port opened.');        
        var frame_obj = { // AT Request to be sent to
            type: xbee.C.FRAME_TYPE.AT_COMMAND,
            destination64: '0013A20040EB556C',            
            command: 'NI',
            commandParameter: [],
        };
        //xbee.serialport.write(xbee.API.buildFrame(frame_obj), function(error) {
        //    console.log('sendframe: ' + error);
        //});
    });

    xbee.serialport.on('data', function (data) {
        console.log('data received: ' + data);
    });

    xbee.serialport.on('error', function (err) {
        console.log('Error: ', err.message);
    });

    // All frames parsed by the XBee will be emitted here
    xbee.API.on('frame_object', function (frame) {
        console.log('>>', frame);
        sensors.window.getStatus(frame);
        // i/o data received
    });

    sensors.window.on('open', function () {
        //if (alarm.state === 'on') {
        // turn on spot light
        // activate alarm
        // there should be a limit of sending email and txt msg.
        email.sendEmail();
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