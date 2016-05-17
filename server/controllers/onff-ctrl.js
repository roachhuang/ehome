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
*/
var Gpio = require('onff').Gpio;

module.exports = function () {
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
        try {
            var io = new Gpio(pin, 'out');
            io.writeSync(val);          
            res.send(200);
        } catch (err) {
            res.status(500).send(err);
        }

    };

    var get = function (req, res) {
        var pin, val;
        pin = req.params.pin;
        if (pin > 0 && pin < 28) {
            console.log(pin);
            try {
                var io = new Gpio(pin, 'in');
                val = io.readSync();             
                res.json(200, { value: val });
            } catch (err) {
                res.status(500).send(err);
            }
        }
    };
    
    var init = function( req, res) {
        return new Gpio(req.params.pin, req.params.directoin);
    };

    return {
        post: post,
        get: get,
        init: init
    };
    /*
        process.on('exit', cb);
        process.on('SIGINT', cb);
        process.on('uncaughtException', cb);
        var cb = function () {
            io.unexport();
        }
    */
};


