'use strict';
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
var Gpio = require('onoff').Gpio;
//var Gpio = require('pi-gpio');
module.exports = function () {
    var myIo = [];

    var post = function (req, res) {
        //if (!res.user) {  only authorized users can do the control
        //res.redirect('/');
        //}
        if (!req.body) {
            return res.sendStatus(400);
        }
        var io, pin = req.params.pin, val = req.body.val;
        console.log(pin);
        console.log(val);
        //console.log(req.body.val);
        io = new Gpio(pin, 'out');
        //Object.assign(myIo[pin.toString()], io);
        io.writeSync(val);
        //io.unexport();
        res.send(200);
    };
    var get = function (req, res) {
        var io, value, pin = req.params.pin;
        if (pin > 0 && pin < 28) {
            console.log(pin);
            //io = new Gpio(pin, 'in');     // this will reset the output
            io = myIo[pin.toString()];
            console.log(io);
            value = io.readSync();
            //io.unexport();
            res.json(200, { value: value });
        }
    };

    return {
        post: post,
        get: get
    };
};


