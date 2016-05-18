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
        // email subject: intrudor
        email.sendEmail;
        // to do: send text msg and start recording video or capture video image 10 times (one time per sec)
    } else {
        lights.switchOn();
        voice.speak("Welcome home");
    }
});