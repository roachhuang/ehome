var rsp = require("serialport");
var xbee = require("xbee");
var util = require('util');
var SerialPort = rsp.SerialPort; // localize object constructor

// connect to xbee module on /dev/ttyUSB0 using serialport.
// Pass xbee.packetParser as the parser - that's it
var serial_xbee = new SerialPort("/dev/ttyAMA0", {
    parser: xbee.packetParser()
});

// listen for incoming xbee data
serial_xbee.on("data", function (data) {
    console.log('xbee data received:', data.type);
    console.log('>>' + util.inspect(data));
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