
'use strict';

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
(sysFsPath = "/sys/class/gpio") in pi-gpio.js: line7 in node_modules/pi-gpio folder.
for pi-gpio lib, pin = physical pin number
*/
//var util = require('util');
var Gpio = require('onoff').Gpio;

module.exports = function (xbee, sensor) {
    var devices;

    var post = function (req, res) {
        //if (!res.user) {  only authorized users can do the control
        //res.redirect('/');
        //}
        if (!req.body) {
            return res.sendStatus(400);
        }
        var pin = req.params.pin, val = req.body.val, addr = req.params.addr;
        //console.log('pin: '+pin+' val: '+val);

        // check if it is local gpio pin or remote xbee pin
        //console.info(typeof pin);
        var gpio;
        if (addr === null) {
            gpio = new LocalOnOff(pin, val);
        } else {
            // D0 ~ D7 on xbee
            gpio = new RemoteOnOff(pin, val, addr);
        }
        gpio.onOff();
        res.sendStatus(200);
    };

    var get = function (req, res) {
        var value, pin = req.params.pin, gpio, addr = req.params.addr;

        //if (pin > 0 && pin < 28) {
        //console.info(typeof pin);
        //if (pin[0] !== 'D') {
        if (addr === null) {
            gpio = new LocalOnOff(pin);
        } else {
            gpio = new RemoteOnOff(pin, addr);
        }
        value = gpio.readPin();
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
        xbee.rmtAtCmd(this.pin, this.val ? [0x05] : [0x04], this.addr);
    };
    RemoteOnOff.prototype.readPin = function () {
        //return sensor.detectors[i].status;
        for (var i in devices) {
            if (devices[i].pin === this.pin && device[i].addr === this.addr) {
                return device[i].status;
            }
        }
    }

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
        var vm = this;
        var strPin = vm.pin.toString();
        exec('cat /sys/class/gpio/gpio' + strPin + '/value', function (err, stdout, stderr) {
            //console.log('stdout: ' + stdout);
            var value = parseInt(stdout);
            //console.log('stderr: ' + stderr);
            if (err !== null) {
                var io = new Gpio(vm.pin, 'in');     // this will reset the output
                //console.log('new io: ' + io);
                value = io.readSync();
            }
            return value;
        });
    };

    var postDevices = function (req, res) {
        //}
        if (!req.body) {
            return res.sendStatus(400);
        }
        devices = req.body;
        res.sendStatus(200);
    };

    return {
        post: post,
        get: get,
        postDevices: postDevices,
        devices: devices
    };
};

