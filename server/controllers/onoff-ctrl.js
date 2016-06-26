'use strict';

if (typeof localStorage === "undefined" || localStorage === null) {
    var nodeLocalStorage = require('node-localstorage').LocalStorage;
}
var localStorage = new nodeLocalStorage('./scratch');

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
var fs = require('fs');
var Gpio = require('onoff').Gpio;

//var Gpio = {};
module.exports = function () {
    var myIo = [];

    var getGpioObj = function (req, res) {
        var pin = req.params.pin, gpioObj;

        gpioObj = new Gpio(pin, 'in');
        console.log('gpioObj: ' + gpioObj);
        //console.log(myIo.length);
        //console.log('process on sigint');
        /*
        process.on('SIGINT', function () {
            myIo[17].unexport();
            myIo[18].unexport();
        });
        */
        res.send(gpioObj);
    };

    var post = function (req, res) {
        //if (!res.user) {  only authorized users can do the control
        //res.redirect('/');
        //}
        if (!req.body) {
            return res.sendStatus(400);
        }
        var io, pin = req.params.pin, val = req.body.val;
        //console.log(pin);
        //console.log(val);
        //console.log(req.body.val);
        io = new Gpio(pin, 'out');
        //Object.assign(myIo[pin.toString()], io);
        io.writeSync(val);
        res.sendStatus(200);
    };

    var get = function (req, res) {
        var value, io, pin = req.params.pin, strPin;
        strPin = pin.toString();

        if (pin > 0 && pin < 28) {
            io = JSON.parse(localStorage.getItem(strPin));
            if (io === undefined || io === null) {
                console.log('new io');
                io = new Gpio(pin, 'in');     // this will reset the output
                localStorage.setItem(strPin, JSON.stringify(io));
            } else {
                console.info('frm local: ' + io);
                io.readSync = function () {
                    console.log(this.readBuffer);
                    fs.readSync(this.valueFd, this.readBuffer, 0, 1, 0);
                    return this.readBuffer[0] === ONE[0] ? 1 : 0;
                }

            }
            value = io.readSync();
            res.status(200).send({ value: value });
        }
    };

    return {
        post: post,
        get: get,
        getGpioObj: getGpioObj
    };



};


