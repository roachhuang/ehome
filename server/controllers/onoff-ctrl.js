
'use strict';
//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise

const exec = require('child_process').exec;
const _ = require('lodash');

/*
The Raspberry Pi's GPIO pins require you to be root to access them.
That's totally unsafe for several reasons. To get around this problem,
you should use the excellent gpio-admin.

Do the following on your raspberry pi:

git clone git://github.com/quick2wire/quick2wire-gpio-admin.git
cd quick2wire-gpio-admin
make
sudo make install
sudo adduser $USER gpio
After this, you will need to logout and log back in. Details, if you are interested.

Next, cd to your project directory and use npm to install pi-gpio in your project.

After changing the path and reinstalling gpio-admin, you need to change the path variable to
(sysFsPath = '/sys/class/gpio') in pi-gpio.js: line7 in node_modules/pi-gpio folder.
for pi-gpio lib, pin = physical pin number
*/
//var util = require('util');
const Gpio = require('onoff').Gpio;

module.exports = function (xbee) {
    //var devices;

    var post = function (req, res) {
        //if (!res.user) {  only authorized users can do the control
        //res.redirect('/');
        //}
        if (!req.body) {
            return res.sendStatus(400);
        }
        var pin = req.params.pin, val = req.body.val, addr = req.params.addr;
        console.log('pin: ' + pin + ' val: ' + val, 'addr:', addr);

        // check if it is local gpio pin or remote xbee pin
        //console.info(typeof pin); D0~D7 on xbee
        let gpio = (pin[0] === 'D') ? new RemoteOnOff(pin, addr, val) : new LocalOnOff(pin, addr, val);

        gpio.onOff()
            .then(function () {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(500).send(err);
            });
    };

    var get = function (req, res) {
        var pin = req.params.pin, addr = req.params.addr;
        console.log('PIN:', pin);
        //if (pin > 0 && pin < 28) {

        let gpio = (pin[0] === 'D') ? new RemoteOnOff(pin, addr) : new LocalOnOff(pin);
        gpio.readPin()
            .then(function (result) {
                //console.log('pin-', pin, 'val-', result);
                //var p = [vm.pin.slice(0, 1), 'IO', vm.pin.slice(1)].join('');
                let p = [pin.slice(0, 1), 'IO', pin.slice(1)].join('');
                res.status(200).send({ value: result.digitalSamples[p] });
            })
            .catch(function (err) {
                console.err('readpin err: ', err);
                res.status(500).send(err);
            });
    };

    //strategy pattern
    function RemoteOnOff(pin, addr, val) {
        this.pin = pin;
        this.addr = addr;
        this.val = val || 0;
        //todo: change to 16 addr

    }
    RemoteOnOff.prototype.onOff = function () {
        //console.info('remote devices');
        // we assume serialport has been opened. todo: check if it is opened
        //xbee.rmtAtCmd(this.pin, this.val ? [0x05] : [0x04], this.addr);
        return xbee.xbeeCmd({
            type: xbee.C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: this.addr,
            command: this.pin,
            commandParameter: this.val ? [0x05] : [0x04],
        });
    };
    /*
    RemoteOnOff.prototype.onOff = function () {
        //console.info('remote devices');
        // we assume serialport has been opened. todo: check if it is opened
        //xbee.rmtAtCmd(this.pin, this.val ? [0x05] : [0x04], this.addr);
        xbee.xbeeCmd({
            type: xbee.C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: this.addr,
            command: this.pin,
            commandParameter: this.val ? [0x05] : [0x04],
        }).then(function (f) {
            console.log('Command successful:', f);
        }).catch(function (e) {
            console.log('Command failed:', e);
        });
    };
    */

    RemoteOnOff.prototype.readPin = function () {
        var vm = this, ret;
        console.log('vm.addr', vm.addr);
        // returns a promise object from xbeeCmd
        return xbee.xbeeCmd({
            type: xbee.C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: vm.addr,
            command: 'IS',
            commandParameter: [],
        });
    };
    /*
    RemoteOnOff.prototype.readPin = function () {
        var vm = this, ret;
        console.log('vm.addr', vm.addr);
        xbee.xbeeCmd({
            type: xbee.C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: vm.addr,
            command: 'IS',
            commandParameter: [],
        }).then(function (f) {
            console.log('Command successful:', f);
            var p = [vm.pin.slice(0, 1), 'IO', vm.pin.slice(1)].join('');
            ret = f.digitalSamples[p];
        }).catch(function (e) {
            console.log('readpin Command failed:', e);
        });
        while (ret === undefined) {
            require('deasync').runLoopOnce();
        }
        return ret;
    };
    */

    function LocalOnOff(pin, val) {
        this.pin = pin;
        this.val = val || 0;
    }
    LocalOnOff.prototype.onOff = function () {
        //console.log('local devices');
        var io = new Gpio(this.pin, 'out');
        io.writeSync(this.val);
    };

    LocalOnOff.prototype.readPin = function () {
        var value, vm = this;
        var strPin = vm.pin.toString();
        exec('cat /sys/class/gpio/gpio' + strPin + '/value', function (err, stdout, stderr) {
            //console.log('stdout: ' + stdout);
            value = parseInt(stdout);
            //console.log('stderr: ' + stderr);
            if (err !== null) {
                var io = new Gpio(vm.pin, 'in');     // this will reset the output
                console.log('new io: ' + io);
                value = io.readSync();
            }
        });
        while (value === undefined) {
            require('deasync').runLoopOnce();
        }
        console.log('pin: ', vm.pin + 'readpin: ', value);
        return value;
    };
    /*
        var postDevices = function (req, res) {
            myDev = req.body;
            //util.inspect(devices);
            console.log('xbee devices: ', myDev);
            if (!req.body) {
                return res.sendStatus(400);
            }
            res.sendStatus(200);
        };
    */

    var atCmd = function (req, res) {
        var addr = req.params.addr;
        var cmd = req.params.cmd;

        var cmdParam = (req.params.cmdParam === 'null') ? [] : req.params.cmdParam;
        //xbee.xbeeCommand({ type: xbee.C.FRAME_TYPE.AT_COMMAND, command: cmd, commandParameter: cmdParam || [] }).then(function (f) {
        console.log('Param: ', cmdParam);

        xbee.xbeeCmd({ type: xbee.C.FRAME_TYPE.AT_COMMAND, command: cmd, commandParameter: cmdParam })
            .then(function (f) {
                // response of the command
                //console.log('Command successful:', f);
                res.status(200).send(f);
            }).catch(function (e) {
                console.log('local at Command failed:', e);
                res.status(500).send(e);
            });

    };

    var rmtAtCmd = function (req, res) {
        var addr = req.params.addr;
        var cmd = req.params.cmd;
        cmd = (cmd === 'V') ? '%V' : cmd;
        var cmdParam = req.params.cmdParam === 'null' ? [] : req.params.cmdParam;
        xbee.xbeeCmd({ type: xbee.C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST, destination64: addr, command: cmd, commandParameter: cmdParam })
            .then(function (f) {
                // response of the command
                console.log('Command successful:', f);
                res.status(200).send(f);
            }).catch(function (e) {
                console.log('rmt Command failed:', e);
                res.status(500).send(e);
            });

    };

    var pair = function (req, res) {
        xbee.newXbee.id = req.params.id;
        xbee.newXbee.type = req.params.type;
        xbee.newXbee.addr64 = null;
        console.log('New ID: ', xbee.newXbee.id);
        xbee.atCmd('ND')
            .then(function (f) {
                res.status(200).send(f);
            }).catch(function (e) {
                res.status(500).send(e);
            });
    };

    var getXbee = function (req, res) {
        //res.json({ devices: xbee.devices });
        res.json({ xbee: xbee });
    };

    var updateDevice = function (req, res) {
        // this a awkward: need to be refacted...
        let newName = 'p'.concat(req.body.name);
        //console.log('put: ', req.body.name);
        let index = _.findIndex(xbee.devices, { name: 'p'.concat(req.params.name) });
        //_.merge(xbee.devices[index], newName);
        xbee.devices[index].name = newName;
        xbee.rmtAtCmd(xbee.devices[index].addr, 'NI', newName).then(function (f) {
            xbee.rmtAtCmd(xbee.devices[index].addr, 'WR');
            res.sendStatus(200);
        })
            .catch(function (err) {
                res.status(500).send(err);
            });
    };

    var delDevice = function (req, res) {
        //let id = req.params.index;
        //rmtAtCmd(xbee.devices[id].addr, 'WR').then(function () {
        let xbeeName = 'p'.concat(req.params.name);
        let index = _.findIndex(xbee.devices, { name: xbeeName });
        //console.log('id: ', index);

        xbee.rmtAtCmd(xbee.devices[index].addr, 'NI', 'null').then(function (f) {
            xbee.rmtAtCmd(xbee.devices[index].addr, 'WR');
            _.remove(xbee.devices, function (device) {
                return device.name === xbeeName;
            });
            res.status(200);
        });

    }
    return {
        post: post,
        get: get,
        atCmd: atCmd,
        rmtAtCmd: rmtAtCmd,
        pair: pair,
        getXbee: getXbee,
        updateDevice: updateDevice,
        delDevice: delDevice
    };
}
