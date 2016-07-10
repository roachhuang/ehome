'use strict';
var events = require('events');
//var request = require('request');

module.exports = function () {

    function Sensor(pin, name) {
        this.pin = pin;
        this.status = false;    // false: normal; true: get trigged
        this.name = name;
        //this.sample = sample;
        events.EventEmitter.call(this);
    }

    Sensor.prototype = new events.EventEmitter();
    // parse frame from xbee-api
    Sensor.prototype.batteryLvl = function (frame) {
        var vm = this, voltage;
        voltage = (frame.commandData[0] * 256 + frame.commandData[1]) / 1024;
        //console.info('voltage: ', voltage);
        vm.status = voltage.toFixed(2).toString() + 'V';
        if (voltage < 2.5) {
            // fire open event
            vm.emit('battery low');
        }
    }
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
    }

    var window = new Sensor('DIO4', 'in the living room');
    var door = new Sensor('DIO0', 'main gate');
    var somkeDetector = new Sensor('AD3', 'at the kitchen');
    // todo: xbeeRouter shouldn't be a sensor obj, think another way if have time
    var xbeeRouter = new Sensor('xbee', 'xbee Router 電力');

    return {
        window: window,
        door: door,
        xbeeRouter: xbeeRouter
    };

    /* Remove the binding of listner1 function
    eventEmitter.removeListener('connection', listner1);
    console.log("Listner1 will not listen now.");

    eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
    console.log(eventListeners + " Listner(s) listening to connection event");
    */

};