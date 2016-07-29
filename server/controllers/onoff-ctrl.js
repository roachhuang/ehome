
'use strict';
//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
var exec = require('child_process').exec;

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
var Gpio = require('onoff').Gpio;

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
        //console.info(typeof pin);
        var gpio;
        if (pin[0] !== 'D') {
            //if (addr === null) {
            gpio = new LocalOnOff(pin, val);
        } else {
            // D0 ~ D7 on xbee
            gpio = new RemoteOnOff(pin, val, addr);
        }
        gpio.onOff();
        res.sendStatus(200);
    };

    var get = function (req, res) {
        var pin = req.params.pin, gpio, addr = req.params.addr;
        //console.log('PIN:', pin);
        //if (pin > 0 && pin < 28) {
        //console.info(typeof pin);
        if (pin[0] !== 'D') {
            //if (addr === null) {
            //console.log('local');
            gpio = new LocalOnOff(pin);
        } else {
            gpio = new RemoteOnOff(pin, addr);
            console.log('remote');
        }
        var value = gpio.readPin();
        console.log('pin-', pin, 'val-', value);
        res.status(200).send({ value: value });
    };

    //strategy pattern
    function RemoteOnOff(pin, val, addr) {
        this.pin = pin;
        this.val = val;
        //todo: change to 16 addr
        this.addr = addr;
    }
    RemoteOnOff.prototype.onOff = function () {
        //console.info('remote devices');
        // we assume serialport has been opened. todo: check if it is opened
        //xbee.rmtAtCmd(this.pin, this.val ? [0x05] : [0x04], this.addr);
        xbee.xbeeCommand({
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
    RemoteOnOff.prototype.readPin = function () {
        var vm = this, ret;
        xbee.xbeeCommand({
            type: xbee.C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: vm.addr,
            command: 'IS',
            commandParameter: [],
        }).then(function (f) {
            console.log('Command successful:', f);
            var p = [vm.pin.slice(0, 1), 'IO', vm.pin.slice(1)].join('');
            ret = f.digitalSamples[p];
        }).catch(function (e) {
            console.log('Command failed:', e);
        });
        while (ret === undefined) {
            require('deasync').runLoopOnce();
        }
        return ret;
    };

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

   var rmtAtCmd = function (req, res) {
        var addr = req.params.addr;
        var cmd = req.params.cmd;
        cmd = (cmd === 'V') ? '%V' : cmd;
        var cmdParam = req.params.cmdParam;
        xbee.xbeeCommand({
            type: xbee.C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: addr,
            command: cmd,
            commandParameter: cmdParam || []
        }).then(function (f) {
            // response of the command
            console.log('Command successful:', f);
            return res.status(200).send(f);
        }).catch(function (e) {
            console.log('Command failed:', e);
        });
    };
    return {
        post: post,
        get: get,    
        rmtAtCmd: rmtAtCmd
    };
};

