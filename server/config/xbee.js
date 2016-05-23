
'use strict';

//var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
//var sensors = require('../controllers/sensors')();

module.exports = function () {
    var C = xbee_api.constants;
    //var xbeeAPI = new xbee_api.XBeeAPI({api_mode: 1});
    var xbeeAPI = new xbee_api.XBeeAPI();

    // ls /dev/ttyAMA0 to make suer it is exist.
    // var serialport = new SerialPort('/dev/ttyAMA0', {
    var serialport = new SerialPort('COM6', {
        baudrate: 9600,
        parser: xbeeAPI.rawParser()
    });
    
    return {
        API: xbeeAPI,
        serialport: serialport
    };

/*
    serialport.on('open', function () {
        console.log('port opened.');
    });


    /*
        serialport.on('open', function () {
            var frame_obj = {
                type: 0x10,
                id: 0x01,
                destination64: '0013A20040EB5559',
                broadcastRadius: 0x00,
                options: 0x00,
                data: 'Hello world'
            };
            serialport.write(xbeeAPI.buildFrame(frame_obj));
            console.log('Sent to serial port.');
        });

    serialport.on("open", function() {
        console.log("open");
        var frame_obj = { // AT Request to be sent to
            type: C.FRAME_TYPE.AT_COMMAND,
            command: "D0",
            commandParameter: [0x05],
        };
        serialport.write(xbeeAPI.buildFrame(frame_obj));
    });


    serialport.on('data', function (data) {
        console.log('data received: ' + data);

    });

    // All frames parsed by the XBee will be emitted here
    xbeeAPI.on('frame_object', function (frame) {
        console.log('>>', frame);
        sensors.window.getStatus(frame);
        // i/o data received

    });
    /*
    {
        type: 0x92, // xbee_api.constants.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX
        remote64: "0013a20040522baa",
        remote16: "7d84",
        receiveOptions: 0x01,
        numSamples: 1,
        digitalSamples: {
            "DIO2": 1,
            "DIO3": 0,
            "DIO4": 1
        },
        analogSamples: {
            "AD1": 644
        }
    }
    */


    /* simple example: query ATD0 on remote xbee module.
    var remote64 = [0x00,0x13,0xa2,0x00,0x40,0x7a,0x1f,0x95];  // <-- you'll need to replace this with the 64-bit hex address of your module
    var remote16 = [0xff,0xfe]; // <-- put the 16 bit address of remote module here, if known. Otherwise use [0xff, 0xfe]

    RemoteAT('D0', null, remote64, remote16);

    void setRemoteState(int value) { // pass either a 0x4 or 0x5 to turn the pin on/off
    Serial.print(0x7E, BYTE); // start byte
    Serial.print(0x0, BYTE); // high part of length (always zero)
    Serial.print(0x10, BYTE); // low part of length (the number of bytes
    // that follow, not including checksum)
    Serial.print(0x17, BYTE); // 0x17 is a remote AT command
    Serial.print(0x0, BYTE); // frame id set to zero for no reply
    // ID of recipient, or use 0xFFFF for broadcast
    Serial.print(00, BYTE);
    Serial.print(00, BYTE);
    Serial.print(00, BYTE);
    Serial.print(00, BYTE);
    Serial.print(00, BYTE);
    108 | Chapter 4: Ins and Outs
    www.it-ebooks.info
    Serial.print(00, BYTE);
    Serial.print(0xFF, BYTE); // 0xFF for broadcast
    Serial.print(0xFF, BYTE); // 0xFF for broadcast
    // 16 bit of recipient or 0xFFFE if unknown
    Serial.print(0xFF, BYTE);
    Serial.print(0xFE, BYTE);
    Serial.print(0x02, BYTE); // 0x02 to apply changes immediately on remote
    // command name in ASCII characters
    Serial.print('D', BYTE);
    Serial.print('1', BYTE);
    // command data in as many bytes as needed
    Serial.print(value, BYTE);
    // checksum is all bytes after length bytes
    long sum = 0x17 + 0xFF + 0xFF + 0xFF + 0xFE + 0x02 + 'D' + '1' + value;
    Serial.print( 0xFF - ( sum & 0xFF) , BYTE ); // calculate the proper checksum
    delay(10); // safety pause to avoid overwhelming the
    // serial port (if this function is not implemented properly)
    }

    // execute an AT command on the local xbee module
    function AT(cmd, val) {      // e.g. 'ID' or '%V'
        var atc = new xbee.ATCommand();
        atc.setCommand(cmd);
        atc.commandParameter = val;
        var b = atc.getBytes();
        serial_xbee.write(b);
        //console.log('Wrote bytes to serial port', b);
    }

    // execute an AT command on a remote xbee module
    function RemoteAT(cmd, val, remote64, remote16) {
        var atc = new xbee.RemoteATCommand();
        atc.setCommand(cmd);
        atc.commandParameter = val;
        atc.destination64 = remote64;
        atc.destination16 = remote16;
        var b = atc.getBytes();
        serial_xbee.write(b);
        //console.log('Wrote bytes to serial port', b);
    }

    */

};
