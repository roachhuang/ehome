'use strict';
var events = require('events');
var email = require('../controllers/emailController');

module.exports = function () {

    function Sensor(pin) {
        this.pin = pin;
        events.EventEmitter.call(this);
    }
    Sensor.prototype = new events.EventEmitter();
    Sensor.prototype.getIoData = function (iOdata) {
        var vm = this;
        if (mask === D4) {
            vm.emit('open');
        }
    };

    var window = new Sensor(D4);
    var door = new Sensor(D3);


    door.on('open', function () {
        if (alarm.state === 'on') {
            alarm.sound();
            hounds.release();
        } else {
            lights.switchOn();
            voice.speak('Welcome home');
        }
    });

    window.on('open', function () {
        if (alarm.state === 'on') {
            // turn on spot light
            // activate alarm
            // email subject: intrudor
            email.sendEmail();
            // send text msg
            // start recording video or capture video image 10 times (one time per sec)
            // 7-eleven call police
            // more ...
        } else {
            lights.switchOn();
            voice.speak('Welcome home');
        }
    });


    /* Remove the binding of listner1 function
    eventEmitter.removeListener('connection', listner1);
    console.log("Listner1 will not listen now.");

    eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
    console.log(eventListeners + " Listner(s) listening to connection event");
    */
     return {
        door: door,
        window: window
    };
};