'use strict';
var email = require('./emailController');
// test purpose
var sms = require('./sms-ctrl');

// init xbee - setup baud rate, com port,  mode, etc.
var xbee = require('../config/xbee-obj')();

// sensor object is passed in from app.js
module.exports = function (sensors) {
    xbee.serialport.on('open', function () {
        console.log('port opened.');
    });

    xbee.serialport.on('data', function (data) {
        console.log('data received: ' + data);
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
        sms();
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