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

After changing the path and reinstalling gpio-admin, you need to change the path variable to ( sysFsPath = "/sys/class/gpio") in pi-gpio.js: line7 in node_modules/pi-gpio folder.
for pi-gpio lib, pin = physical pin number
*/

//var gpio = require("pi-gpio");
var gpio = {};
module.exports = function (req, res) {

    var post = function (req, res) {
        //if (!res.user) {  only authorized users can do the control
        //res.redirect('/');
        //}
        if (!req.body) {
            return res.sendStatus(400);
        }
        var pin = req.params.pin;
        var val = req.body.val;
        console.log(pin);
        console.log(val);
        //console.log(req.body.val);

        gpio.open(pin, 'output', function (err) {

            gpio.write(pin, val, function (err) {
                if (err) throw err;
                gpio.close(pin);
                res.send(200);
            });
        });
    };
    var get = function (req, res) {
        var pin = req.params.pin;
        if (pin > 0 && pin < 20) {         
            // just read it w/o opening it as input, so its status won't be reset after reading.
            //gpio.open(pin, 'input', function (err) {

            gpio.read(pin, function (err, value) {
                // gpio.close(pin);
                if (err) {
                    res.status(500).send(err);
                } else {
                    console.log('read pin ' + pin + ' value = ' + value);
                    res.json(200, { value: value });
                }
            });

            //});
        }
    };

    process.on('SIGINT', function () {
        var i;

        console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");

        console.log("closing GPIO...");
        /* todo: close port
        for (i in inputs) {
            gpio.close(inputs[i].pin);
        }
        */
        process.exit();
    });
    

    return {
        post: post,
        get: get
    };


};


