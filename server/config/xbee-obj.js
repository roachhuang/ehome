
'use strict';

var util = require('util');
var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
// in order to get devices object
var onOff = require('../controllers/onoff-ctrl');

module.exports = function (sensor) {
    var routerAddr = '0013A20040EB556C';
    var C = xbee_api.constants;
    var xbeeAPI = new xbee_api.XBeeAPI({ api_mode: 1 });
    //var xbeeAPI = new xbee_api.XBeeAPI();

    // ls /dev/ttyAMA0 to make suer it is exist.

    var serialport = new SerialPort('/dev/ttyAMA0', {
        //var serialport = new SerialPort('COM4', {     // this line is for testing on PC
        baudrate: 9600,
        parser: xbeeAPI.rawParser(),
        //rtscts: true
    }, function (err) {
        if (err) {
            return console.log('Error: ', err.message);
        }
    });

    serialport.on('open', function () {
        console.log('port opened.');
        atCmd('ND', []);
        // read router's battery level every 2 hrs
        for (var i in sensor.gauges.battery) {
            setInterval(rmtAtCmd('%V', [], sensor.gauges.battery.addr), 2 * 60 * 60 * 1000);
        }
        // force digital and analog input sample (broadcast cmd)
        rmtAtCmd('AI', [], '00 00 00 00 00 00 FF FF');
        rmtAtCmd('JV', [1], '00 00 00 00 00 00 FF FF');
        rmtAtCmd('IS', [], '00 00 00 00 00 00 FF FF');
    });

    serialport.on('data', function (data) {
        console.log('data received: ' + data);
    });

    serialport.on('error', function (err) {
        console.log('Error: ', err.message);
    });

    // All frames parsed by the XBee will be emitted here
    xbeeAPI.on('frame_object', function (frame) {
        console.log('>>' + util.inspect(frame));
        // ZigBee IO Data Sample Rx Indicator (ZNet, ZigBee)
        console.log('frame type: ', frame.type);
        switch (frame.type) {
            case 0x97: // remote AT command response
                console.log('>>' + util.inspect(frame));
                if (frame.commandStatus === 0x00 && frame.command === '%V') {
                    for (var i in sensor.gauges.battery) {
                        if (sensor.gauges.battery[i].addr === frame.remote64) {
                            sensor.gauges.battery[i].getBatteryLvl(frame);
                        }
                    }
                }
                break;
            case 0x88:  // local AT cmd response
                /*
                >>{ type: 136,
                id: 1,
                command: 'ND',
                commandStatus: 0,
                nodeIdentification:
                { remote16: 'edee',
                remote64: '0013a20040eb556c',
                nodeIdentifier: 'r01',
                remoteParent16: 'fffe',
                deviceType: 1,
                sourceEvent: 0,
                digiProfileID: 'c105',
                digiManufacturerID: '101e' } }
                */
                (frame.command === 'ND')
                frame.nodeIdentification.remote64
                break;
            case 0x92:  // IO data sample RX indicator
                /*
                { type: 146,                
                remote64: '0013a20040eb556c',
                remote16: 'edee',
                receiveOptions: 1,
                digitalSamples: { DIO0: 0, DIO4: 1 },
                analogSamples: {},
                numSamples: 1 }
                */

                for (i in sensor.detectors) {
                    sensor.detectors[i].getStatus(frame);
                }
                // read remote i/o pin status from farme and update the status value in devices
                for (i in onOff.devices) {
                    if (frame.remote64 === onOff.devices[i].addr) {
                        onOff.devices[i].status = frame.digitalSamples[onOff.devices[i].pin];
                    }
                }
                break;
            default:
                break;
        }
    });

    var rmtAtCmd = function (cmd, param, dest64) {
        var frame_obj = { // AT Request to be sent to
            type: 0x17,
            destination64: dest64,
            command: cmd,
            commandParameter: param
        };

        serialport.write(xbeeAPI.buildFrame(frame_obj), function (err) {
            console.log(xbeeAPI.buildFrame(frame_obj));
            if (err) throw (err);
            else {
                console.log(err);
            }
        });
    };
    var atCmd = function (cmd, param) {
        var frame_obj = { // AT Request to be sent to
            type: 0x08,
            command: cmd,
            commandParameter: param
        };

        serialport.write(xbeeAPI.buildFrame(frame_obj), function (err) {
            console.log(xbeeAPI.buildFrame(frame_obj));
            console.log(err);
        });
    };
    return {
        atCmd: atCmd,
        rmtAtCmd: rmtAtCmd
    };

    /*
        serialport.on('open', function () {
            console.log('port opened.');
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
