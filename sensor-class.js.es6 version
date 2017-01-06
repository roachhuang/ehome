'use strict';
var eventEmitter = require('events').EventEmitter;
var email = require('../controllers/emailController')();
//var request = require('request');

//module.exports = function (io) {
module.exports = function () {

    class Sensor extends eventEmitter() {
        constructor(pin = null, name = null, addr = null) {
            super();
            this.pin = pin;
            this.name = name;
            this.addr = addr;
            // false: normal; true: get trigged
            this.status = false;
            this.data = [];
            // voltage
            this.battery = 0;
            // sensors are enabled by default
            this.enable = true;
        }
        _batteryLow() {
            email.sendEmail(this.name + 'battery low');
        }
        getBatteryLvl(){

        }
        getStatus(frame) {
            var vm = this;
            console.log('detected', vm.pin, vm.addr);
            //if (frame.hasOwnProperty('digitalSamples.DIO4')) {
            if (frame.digitalSamples[vm.pin] === 1 && frame.remote64 === vm.addr) {

                // window get opened
                vm.status = true;
                // fire open event
                vm.emit('open');
            } else {
                vm.status = false;
            }
            // inform client
            //io.sockets.emit('intruder', vm.status);
            //console.log('fire alarm evt', vm.status);
        }

        //this.sample = sample;
        //events.EventEmitter.call(this);
    this.on('open', this._open);
    this.on('batteryLow', this._batteryLow);
    _open() {
        if (this.enable === true) {
            // turn on spot light
            // activate alarm
            // there should be a limit of sending email and txt msg.
            email.sendEmail(this.name);
            // send text msg
            //twilio.sendMessage();
            //twilio.makeCall();
            // start recording video or capture video image 10 times (one time per sec)
            // 7-eleven call police
            // alert.window = true;
            //} else {
            //lights.switchOn();
            //voice.speak('Welcome home');
        }
    }

}

// parse frame from xbee-api



/*
var window = new Sensor('DIO4', 'in the living room');
var door = new Sensor('DIO0', 'main gate');
var somkeDetector = new Sensor('AD3', 'at the kitchen');
*/
// todo: xbeeRouter shouldn't be a sensor obj, think another way if have time
//var xbeeRouter = new Sensor('xbee', 'xbee Router 電力');

return {
    //detectors: detectors,
    //gauges: gauges
    constructor: Sensor
};

    /* Remove the binding of listner1 function
    eventEmitter.removeListener('connection', listner1);
    console.log("Listner1 will not listen now.");

    eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
    console.log(eventListeners + " Listner(s) listening to connection event");
    */

};