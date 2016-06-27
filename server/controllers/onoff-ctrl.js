
'use strict';

var xbee = require('../config/xbee-obj')();

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
    //var myIo = [];
    var frame_obj = {
        type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
        id: 0x01, // optional, nextFrameId() is called per default
        destination64: "0013a20040401122",
        destination16: "fffe", // optional, "fffe" is default
        remoteCommandOptions: 0x02, // optional, 0x02 is default
        command: "D3",
        // 0x04: low, 0x05: high
        commandParameter: [0x01] // Can either be string or byte array.
    }

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
        //console.log('pin: '+pin+' val: '+val);

        // check if it is local gpio pin or remote xbee pin
        if (typeof pin === 'number') {
            io = new Gpio(pin, 'out');
            io.writeSync(val);
            // D0 ~ D7 on xbee
        } else {
            // we assume serialport has been opened. todo: check if it is opened
            frame_obj.command = pin;
            frame_obj.commandParameter = val ? 0x05 : 0x04;
            serialport.write(xbeeAPI.buildFrame(frame_obj));
        }
        res.sendStatus(200);
    };

    var get = function (req, res) {
        var value, io, pin = req.params.pin, strPin, ONE = new Buffer('1');
        strPin = pin.toString();

        if (pin > 0 && pin < 28) {
            io = JSON.parse(localStorage.getItem(strPin));
            console.info('io read frm local: ' + io);
            if (io === undefined || io === null) {
                io = new Gpio(pin, 'in');     // this will reset the output
                console.log('new io: ' + io);
                console.log(io.readBuffer);
                localStorage.setItem(strPin, JSON.stringify(io));
            } else {
                console.info('frm local: ' + io);
                io.readSync = function () {
                    var readBuffer = new Buffer(16);
                    valueFd = fs.openSync(this.valuePath, 'r+');
                    console.log(valueFd);
                    fs.readSync(valueFd, readBuffer, 0, 1, 0);
                    return readBuffer[0] === ONE[0] ? 1 : 0;
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

