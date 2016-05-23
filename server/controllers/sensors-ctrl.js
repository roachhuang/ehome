'use strict';
var events = require('events');
var email = require('../controllers/emailController');

module.exports = function () {

    function Sensor(pin) {
        this.pin = pin;
        this.status = false;    // normal state (closed)
        events.EventEmitter.call(this);
    }
    Sensor.prototype = new events.EventEmitter();
    // parse frame from xbee-api
    Sensor.prototype.getStatus = function (frame) {
        var vm = this;
        if (frame.digitalSamples.DIO4 === 0) {
            vm.status = false;
        }
        else if (frame.digitalSamples.DIO4 === 1 && vm.status === false) {
            vm.status = true;     // triggered
            // window get opened
            vm.emit('open');    // emit once if it gets opened coz we don't want to keep sending email.
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
        // send alert message every 3s for 5 times
        var times = 0;
        var actions = setInterval(function () {
            if (times < 5) {
                times++;
                email.sendEmail();
                // send text msg
                // start recording video or capture video image 10 times (one time per sec)
                // 7-eleven call police
                // alert.window = true;
                //} else {
                //lights.switchOn();
                //voice.speak('Welcome home');
            } else {
                clearInterval(actions);
            }
        }, 3000);
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