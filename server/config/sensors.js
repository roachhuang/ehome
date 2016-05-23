'use strict';
var events = require('events');

module.exports = function (req, res) {

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
        if (frame.digitalSamples.DIO4 === 1) {
            // window get opened
            vm.emit('open');
            res.redirect('/');  //todo: this is for go / to readSensors but not knowing if it'll work.
        }
    };
      
    return {
        window: new Sensor('DIO4', 'in the living room'),
        door: new Sensor('DIO3', 'main gate')
    };

    /* Remove the binding of listner1 function
    eventEmitter.removeListener('connection', listner1);
    console.log("Listner1 will not listen now.");

    eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
    console.log(eventListeners + " Listner(s) listening to connection event");
    */

};