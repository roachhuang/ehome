'use strict';
var events = require('events');
var email = require('../controllers/emailController')();
//var request = require('request');

module.exports = function (io) {

    function Sensor(pin, name, addr) {
        this.pin = pin || null;
        this.status = false;    // false: normal; true: get trigged
        this.data = [];
        this.name = name;
        this.addr = addr || null;
        // voltage
        this.battery = 0;
        //this.sample = sample;
        events.EventEmitter.call(this);
        this.on('open', this._open);
        this.on('batteryLow', this._batteryLow);
    }
    Sensor.prototype = new events.EventEmitter();

    Sensor.prototype._batteryLow = function () {
        email.sendEmail(this.name + 'battery low');
    };

    Sensor.prototype._open = function () {
        //if (alarm.state === 'on') {
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
        // }
    };

    // parse frame from xbee-api

    Sensor.prototype.getStatus = function (frame) {
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
        io.sockets.emit('intruder', vm.status);
        console.log('fire alarm evt', vm.status);
    };

    //maybe i shouldn't use push instead using detectors.window = new Sensor(....)
    var detectors = [];
    detectors.push(new Sensor('DIO4', 'in the living room', '0013a20040eb556c'));
    //detectors.push(new Sensor('DIO0', 'main gate'));
    //detectors.push(new Sensor('DIO5', 'somker detector at the kitchen', '0013a20040eb556c'));

    function Gauge(name, addr) {
        this.addr = addr;   //toto: change to addr16 if have time
        this.name = name;
        this.data = [];
        //events.EventEmitter.call(this);
    }


    //var gauges = {};
    //gauges.battery = [];

    //gauges.dht = new Gauge();
    //gauges.battery.push(new Gauge('xbee01', '0013A20040EB556C'));

    /*
    var window = new Sensor('DIO4', 'in the living room');
    var door = new Sensor('DIO0', 'main gate');
    var somkeDetector = new Sensor('AD3', 'at the kitchen');
    */
    // todo: xbeeRouter shouldn't be a sensor obj, think another way if have time
    //var xbeeRouter = new Sensor('xbee', 'xbee Router 電力');

    return {
        detectors: detectors,
        //gauges: gauges
    };

    /* Remove the binding of listner1 function
    eventEmitter.removeListener('connection', listner1);
    console.log("Listner1 will not listen now.");

    eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
    console.log(eventListeners + " Listner(s) listening to connection event");
    */

};