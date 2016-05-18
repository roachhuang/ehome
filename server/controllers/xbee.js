
'use strict';

var events = require('events');

var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

var eventEmitter = new events.EventEmitter();

// called when window opened
var takeAction = function () {
    console.log('listner1 executed.');
}

// Bind the connection event with the listner1 function
eventEmitter.addListener('windowOpened', takeAction);
// Bind the connection event with the listner2 function
eventEmitter.on('connection', listner2);

var eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
console.log(eventListeners + " Listner(s) listening to connection event");

var serialport = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
});
serialport.on("open", function () {
    var frame_obj = {
        type: 0x10,
        id: 0x01,
        destination64: "0013A200407A25B5",
        broadcastRadius: 0x00,
        options: 0x00,
        data: "Hello world"
    };
    serialport.write(xbeeAPI.buildFrame(frame_obj));
    console.log('Sent to serial port.');
});
serialport.on('data', function (data) {
    console.log('data received: ' + data);
    if (D4 === 1) {
        // window is opend, fire the window opened event
        eventEmiter.emit('intrudor');
    }
});



// Remove the binding of listner1 function
eventEmitter.removeListener('connection', listner1);
console.log("Listner1 will not listen now.");

eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
console.log(eventListeners + " Listner(s) listening to connection event");

// All frames parsed by the XBee will be emitted here
xbeeAPI.on("frame_object", function (frame) {
    console.log(">>", frame);
});

// execute an AT command on the local xbee module
function AT(cmd, val) {      // e.g. 'ID' or '%V'
    var atc = new xbee.ATCommand();
    atc.setCommand(cmd);
    atc.commandParameter = val;
    b = atc.getBytes();
    serial_xbee.write(b);
    //console.log('Wrote bytes to serial port', b);
};


// execute an AT command on a remote xbee module
function RemoteAT(cmd, val, remote64, remote16) {
    var atc = new xbee.RemoteATCommand();
    atc.setCommand(cmd);
    atc.commandParameter = val;
    atc.destination64 = remote64;
    atc.destination16 = remote16;
    b = atc.getBytes();
    serial_xbee.write(b);
    //console.log('Wrote bytes to serial port', b);
}

/* simple example: query ATD0 on remote xbee module.
var remote64 = [0x00,0x13,0xa2,0x00,0x40,0x7a,0x1f,0x95];  // <-- you'll need to replace this with the 64-bit hex address of your module
var remote16 = [0xff,0xfe]; // <-- put the 16 bit address of remote module here, if known. Otherwise use [0xff, 0xfe]

RemoteAT('D0', null, remote64, remote16);
*/