'use strict';
var events = require('events');
//var request = require('request');

module.exports = function () {

    function Sensor(pin, name, sample) {
        this.pin = pin;
        this.status = false;    // false: normal; true: get trigged
        this.name = name;
        //this.sample = sample;
        events.EventEmitter.call(this);
    }
    Sensor.prototype = new events.EventEmitter();
    // parse frame from xbee-api
    Sensor.prototype.getStatus = function (frame) {
        var vm = this;

        //if (frame.hasOwnProperty('digitalSamples.DIO4')) {
        if (frame.digitalSamples[vm.pin] === 1) {
            // window get opened
            vm.status = true;
            // fire open event
            vm.emit('open');
            /*
            request.get('http://localhost:3000/', function(err, res, body){
                if (err) {
                    console.log(err);
                } else {
                    //console.log(res);
                }
            });
            */
        } else {
            vm.status.false;
        }

        //};
    }

    var window = new Sensor('DIO4', 'in the living room');
    var door = new Sensor('DIO3', 'main gate');
    var somkeDetector = new Sensor('AD3', 'at the kitchen');
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