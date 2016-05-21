'use strict';
var events = require('events');
var email = require('../controllers/emailController');

module.exports = function () {

    function Sensor(pin) {
        this.pin = pin;
        events.EventEmitter.call(this);
    }
    Sensor.prototype = new events.EventEmitter();
    // parse frame from xbee-api
    Sensor.prototype.getStatus = function (frame) {
        var vm = this;
        if (frame.digitalSamples.DIO4 === 1) {
            // window get opened
            vm.emit('open');
        }
    };

    var window = new Sensor('DIO4');
    var door = new Sensor('DIO3');

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
    window.on('open', function () {
        //if (alarm.state === 'on') {
        // turn on spot light
        // activate alarm
        // there should be a limit of sending email and txt msg.
        email.sendEmail();
        // send text msg
        // start recording video or capture video image 10 times (one time per sec)
        // 7-eleven call police
        // alert.window = true;
        //} else {
        //lights.switchOn();
        //voice.speak('Welcome home');
        // }
    });


    /* Remove the binding of listner1 function
    eventEmitter.removeListener('connection', listner1);
    console.log("Listner1 will not listen now.");

    eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
    console.log(eventListeners + " Listner(s) listening to connection event");
    */
    return {
        window: window,
        door: door
    };
};