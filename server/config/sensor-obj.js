'use strict';
var events = require('events');
var email = require('../controllers/emailController')();
//var request = require('request');

module.exports = function () {

    function Sensor(pin, name) {
        this.pin = pin || null;
        this.status = false;    // false: normal; true: get trigged
        this.data = [];
        this.name = name;
        //this.sample = sample;
        events.EventEmitter.call(this);
        this.on('open', this._open);
    }
    Sensor.prototype = new events.EventEmitter();

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
        //if (frame.hasOwnProperty('digitalSamples.DIO4')) {
        if (frame.digitalSamples[vm.pin] === 1) {
            // window get opened
            vm.status = true;
            // fire open event
            vm.emit('open');
        } else {
            vm.status = false;
        }
    };

    var detectors = [];
    detectors.push(new Sensor('DIO4', 'in the living room'));
    //detectors.push(new Sensor('DIO0', 'main gate'));
    detectors.push(new Sensor('AD3', 'somker detector at the kitchen'));

    function Gauge(addr16) {
        this.addr16 = addr16;
        this.data = [];
        //events.EventEmitter.call(this);
    }

    Gauge.prototype.getBatteryLvl = function (frame) {
        var vm = this, voltage;
        voltage = (frame.commandData[0] * 256 + frame.commandData[1]) / 1024;
        //console.info('voltage: ', voltage);
        vm.data = voltage.toFixed(2);
        if (voltage < 2.5) {
            // fire open event
            //vm.emit('battery low');
        }
    };

    var gauges = {};
    gauges.dht = new Gauge();
    gauges.battery = new Gauge('01');

    /*
    var window = new Sensor('DIO4', 'in the living room');
    var door = new Sensor('DIO0', 'main gate');
    var somkeDetector = new Sensor('AD3', 'at the kitchen');
    */
    // todo: xbeeRouter shouldn't be a sensor obj, think another way if have time
    //var xbeeRouter = new Sensor('xbee', 'xbee Router 電力');

    return {
        detectors: detectors,
        gauges: gauges
    };

    /* Remove the binding of listner1 function
    eventEmitter.removeListener('connection', listner1);
    console.log("Listner1 will not listen now.");

    eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
    console.log(eventListeners + " Listner(s) listening to connection event");
    */

};