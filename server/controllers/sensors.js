'use strict';

var email = require('../controllers/emailController');

// Import events module
var events = require('events');
// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();

// Bind the connection event with the listner1 function
eventEmitter.addListener('connection', listner1);


door.on("open", function () {
    if (alarm.state == "on") {
        alarm.sound();
        hounds.release();
    } else {
        lights.switchOn();
        voice.speak("Welcome home");
    }
});

window.on("open", function () {
    if (alarm.state == "on") {
        // turn on spot light
        // activate alarm
        // email subject: intrudor
        email.sendEmail;
        // send text msg
        // start recording video or capture video image 10 times (one time per sec)
        // 7-eleven call police
        // more ...
    } else {
        lights.switchOn();
        voice.speak("Welcome home");
    }
});