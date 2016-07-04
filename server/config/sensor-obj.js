'use strict';
var events = require('events');
//var request = require('request');

module.exports = function () {

    function Sensor(pin, name) {
        this.pin = pin;
        this.status = false;    // false: normal; true: get trigged
        this.name = name;
        events.EventEmitter.call(this);
    }
    Sensor.prototype = new events.EventEmitter();
    // parse frame from xbee-api
    Sensor.prototype.getStatus = function (frame) {
        var vm = this;
        if (typeof frame.digitalSamples.DIO4 === 'undefined') {
            this.status = false;
        } else if (frame.digitalSamples.DIO4 === 1) {
            // window get opened
            this.status = true;
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
            this.status = false;
        }
    };
    var window = new Sensor('DIO4', 'in the living room');
    var door = new Sensor('DIO3', 'main gate');

    return {
        window: window,
        door: door
    };

    /* Remove the binding of listner1 function
    eventEmitter.removeListener('connection', listner1);
    console.log("Listner1 will not listen now.");

    eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
    console.log(eventListeners + " Listner(s) listening to connection event");
    */

};