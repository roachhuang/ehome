
'use strict';
const _ = require('lodash');
const util = require('util');
//const notifier = require('node-notifier');
const SerialPort = require('serialport');
const xbee_api = require('xbee-api');
const C = xbee_api.constants;
//var Q = require('q');
const Sensor = require('./sensor-class')().constructor;

// in order to get devices object. todo: may be change to use deive router instead.
//var onOff = require('../controllers/onoff-ctrl')();

module.exports = function () {
    var newXbee = { addr64: '', addr16: '', id: null, vcc: null, type: null };

    class Device {
        constructor(GpioPin, name, addr) {
            this.name = name;
            this.pin = GpioPin || 'D0'; // deafult pin D0
            this.addr = addr || null;
        }
        //this.status = 0;    //todo: 0 or null (init state?)
        //this.error = null;
    }
    var sensors = [], devices = [];
    //var routerAddr = '0013A20040EB556C';

    var xbeeAPI = new xbee_api.XBeeAPI({ api_mode: 1 });

    // ls /dev/ttyAMA0 to make suer it is exist.

    var serialport = new SerialPort('/dev/ttyAMA0', {
        //var serialport = new SerialPort('COM4', {     // this line is for testing on PC
        baudrate: 9600,
        parser: xbeeAPI.rawParser()
        //rtscts: true
    }, function (err) {
        if (err) {
            return console.log('Error: ', err.message);
        }
    });

    // How long are we prepared to wait for a response to our command?
    const maxWait = 5000; // ms
    // initXbee is called as soon as serial port is opend.
    var initXbee = function () {
        atCmd('ND');
        /*
        rmtAtCmd('0013a20040eb5559', 'NI', 'null')
            .then(writeToXbee('0013a20040eb5559'))
            //.then(atCmd('ND'))
            .catch(function (err) {
                console.error(err);
            });

        rmtAtCmd('0013A20040EB556C', 'NI', 'null')
            .then(writeToXbee('0013A20040EB556C'))
            .then(atCmd('ND'))
            .catch(function (err) {
                console.error(err);
            });
        */
        /* node indentifer command. this is to clear NI of a node for teting purpose. to be removed when going production.
        rmtAtCmd('0013A20040EB556C', 'NI', 'null').then(function () {
            console.log('reset router name');
            atCmd('ND');
        });
        */
        //rmtAtCmd(routerAddr, '%V');
        /*
                xbeeCommand({
                    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
                    command: 'V+',
                    destination64: routerAddr,
                    // set battery threshold 0x800 * 1200/1024 = 2.4v
                    commandParameter: [800],
                }).then(function (f) {
                    console.log('Command successful:', f);
                }).catch(function (e) {
                    console.log('Command failed:', e);
                });
    
                var frameId = xbeeAPI.nextFrameId();
                var f = {
                    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
                    id: frameId,
                    command: 'IR',
                    destination64: routerAddr,
                    commandParameter: [0]
                };
                serialport.write(xbeeAPI.buildFrame(f));
        */
        //rmtAtCmd('000000000000FFFF', 'PM', [0]);
        //rmtAtCmd('000000000000FFFF', 'V+', [0x900]);
        //Read information regarding last node join request
        //rmtAtCmd('000000000000FFFF', 'AI');
        //rmtAtCmd('000000000000FFFF', 'WR');
        //rmtAtCmd('JV', [0x01], '000000000000FFFF');
    };

    serialport.on('open', function () {
        console.log('port opened.');
        initXbee();
    });

    serialport.on('error', function (err) {
        console.log('Error: ', err.message);
    });

    xbeeAPI.on('frame_object', function (frame) {
        var v;
        console.log('outer>>' + util.inspect(frame));
        // ZigBee IO Data Sample Rx Indicator (ZNet, ZigBee)
        //console.log('frame type: ', frame.type);
        switch (frame.type) {
            case 0x97: // remote AT command response
                //console.log('Outer >>' + util.inspect(frame));
                /*
                if (frame.commandStatus === 0x00) {
                    if (frame.command === '%V') {
                        for (i in sensor.detectors) {
                            if (sensor.detectors[i].addr === frame.remote64) {
                                v = (frame.commandData[0] * 256 + frame.commandData[1]) * 1200 / 1024;
                                sensor.detectors[i].battery = v;
                                //console.info('voltage: ', v);
                                //vm.data = voltage.toFixed(2);
                            }
                        }
                    } else if (frame.command === 'IS') {
                        util.inspect(frame);
                        /*
                        v = (frame.commandData[4] * 256 + frame.commandData[5]) * 1200 / 1024;
                        for (i in sensor.detectors) {
                            if (sensor.detectors[i].addr === frame.remote64) {
                                sensor.detectors[i].battery = v;
                                sensor.detectors[i].emit('batteryLow');
                            }
                        }
    
                    }
    }
        */
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
                if (frame.commandStatus !== C.COMMAND_STATUS.ERROR) {
                    if (frame.command === 'ND') {
                        console.log('newXbee.id: ', newXbee.id);
                        var id = frame.nodeIdentification.nodeIdentifier;
                        newXbee.addr64 = frame.nodeIdentification.remote64;
                        if (id === 'null') {
                            addNewDev();
                        } else {
                            // the xbee has name.
                            checkIfObjExist(id);
                        }
                    }
                }
                else {
                    console.error('cmd error:' + frame.commandStatus);
                }
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
                console.log('I/O data sample TX indicator');
                for (let i in sensors) {
                    if (sensors.hasOwnProperty(i)) {
                        sensors[i].getStatus(frame);
                    }
                }
                break;
            default:
                break;
        }
    });

    function writeNameToXbee() {
        var givenName = newXbee.type + newXbee.id;
        console.log('paried: ', newXbee.id);
        rmtAtCmd(newXbee.addr64, 'NI', givenName)
            .then(function () {
                rmtAtCmd(newXbee.addr64, 'WR');
                newXbee.id = newXbee.type = null;
            })
            .catch(function (err) {
                console.error('write xbee name err: ', err);
            });
    }

    function newDevObj(devType, name) {
        if (devType === 's') {
            //console.log('new sensorObj: ', name);
            sensors.push(new Sensor('DIO4', name, newXbee.addr64));
        } else {
            //console.log('new pwrObj: ', name);
            devices.push(new Device('D0', name, newXbee.addr64));
        }
    }

    function addNewDev() {
        if (newXbee.id !== null) {
            writeNameToXbee(newXbee.type);
            newDevObj(newXbee.type, newXbee.type + newXbee.id);
        } else {
            console.log('just ND cmd resp, not pair!');
        }
    }

    // the xbee already has a name
    function checkIfObjExist(id) {
        // to see if it is a device or a sensor
        var index = (id[0] === 's') ? _.findIndex(sensors, { name: id }) : _.findIndex(devices, { name: id });
        if (index === -1) {
            newDevObj(id[0], id);
        }
        /*
    for (i in sensors) {
        if (sensors.hasOwnProperty(i)) {
            // check if the device exists
            if (sensors[i].name === id) {
                exist = true;
                console.log('exists!');
                break;
            }
        }
    }
    */

    }
    /*
        var xbeeCmd = function (f) {
            var defer = Q.defer();
     
            f.id = xbeeAPI.nextFrameId();
            var rsp = false, rspFrame;
            serialport.write(xbeeAPI.buildFrame(f), function (err) {
                if (err) {
                    defer.reject(err);
                }          
            });
           
            xbeeAPI.on('frame_object', function (rcvFrame) {
                if (rcvFrame.id === f.id) {
                    defer.resolve(rcvFrame);    
                    console.log('rsp received!');            
                }
            });
            // Return our promise with a timeout
            return defer.promise.timeout(maxWait);
        };
    */

    var xbeeCmd = frame => {
        // We're going to return a promise
        const OK = 0;
        return new Promise(function (resolve, reject) {
            var callback = function (receivedFrame) {
                let vm = this;
                console.log('inner');
                if (receivedFrame.id === frame.id) {
                    // This is our frame's response. Resolve the promise.
                    console.log('got correspondent response!: ', frame.id);
                    xbeeAPI.removeListener('frame_object', callback);
                    clearTimeout(timer);
                    if (receivedFrame.commandStatus === OK) {
                        console.log('resloved');
                        resolve(receivedFrame);
                    }
                    else {
                        reject(new Error(receivedFrame.commandStatus));
                    }
                }
            };

            frame.id = xbeeAPI.nextFrameId();
            serialport.write(xbeeAPI.buildFrame(frame), function (err) {
                if (err) {
                    reject(new Error(err));
                }
                // Attach callback so we're waiting for the response
                xbeeAPI.on('frame_object', callback);
            });

            let timer = setTimeout(function () {
                xbeeAPI.removeListener('frame_object', callback);
                reject(new Error('timeout'));
            }, maxWait + 1000);
        });
    };
    /*
       var xbeeCmd = frame => {
            // set frame id
            frame.id = xbeeAPI.nextFrameId();
     
            // We're going to return a promise
            var defer = Q.defer();
     
            var callback = function (receivedFrame) {
                if (receivedFrame.id === frame.id) {
                    // This is our frame's response. Resolve the promise.
                    console.log('get correspondent response!: ', frame.id);
                    defer.resolve(receivedFrame);
                }
            };
     
            // Clear up: remove listener after the timeout and a bit, it's no longer needed
            setTimeout(function () {
                xbeeAPI.removeListener('frame_object', callback);
            }, maxWait + 1000);
     
            // Attach callback so we're waiting for the response
            xbeeAPI.on('frame_object', callback);
     
            // Pass the bytes down the serial port
            console.log('send 2 serialport: ', util.inspect(xbeeAPI.buildFrame(frame)));
            serialport.write(xbeeAPI.buildFrame(frame), function (err) {
                if (err) {
                    defer.reject(err);
                }
            });
     
            // Return our promise with a timeout
            return defer.promise.timeout(maxWait);
        }
    */
    var atCmd = (cmd, cmdParam) => xbeeCmd({ type: C.FRAME_TYPE.AT_COMMAND, command: cmd, commandParameter: cmdParam || [] });

    /*
    xbeeCommand({
        type: C.FRAME_TYPE.AT_COMMAND,
        command: cmd,
        commandParameter: cmdParam || []
    }).then(function (f) {
        console.log('Command successful:', f);
        return f;
    }).catch(function (e) {
        console.log('Command failed:', e);
    });
    */
    //};

    var rmtAtCmd = (addr, cmd, cmdParam) => xbeeCmd({ type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST, destination64: addr, command: cmd, commandParameter: cmdParam || [] });

    var writeToXbee = function (addr) {
        rmtAtCmd(addr, 'WR', []).then(function (f) {
            return 0;
        }).catch(function (e) {
            console.log('WR Command failed:', e);
        });
    }
    //var rmtAtCmd = function (addr, cmd, cmdParam) {
    //    return xbeeCmd({ type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST, destination64: addr, command: cmd, commandParameter: cmdParam || [] });
    //};    

    return {
        //xbeeCommand: xbeeCommand,
        xbeeCmd: xbeeCmd,
        C: C,
        xbeeAPI: xbeeAPI,
        newXbee: newXbee,    // new detected xbee
        rmtAtCmd: rmtAtCmd,
        atCmd: atCmd,
        sensors: sensors,
        devices: devices
    };
};
