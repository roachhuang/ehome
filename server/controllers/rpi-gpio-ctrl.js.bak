'use strict';
var gpio = require('rpi-gpio');
var exec = require('child_process').exec;

module.exports = function () {
    var get = function (req, res) {
        var value, pin = req.params.pin;
        console.log('pin: ' + pin);
        exec('cat /sys/class/gpio/gpio' + pin.toString(), function (err, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (err !== null) {
                gpio.setup(pin, gpio.DIR_OUT, readInput);
            }
        })

        function readInput() {
            gpio.read(pin, function (err, value) {
                console.log('The value is ' + value);
                res.status(200).send({ value: value });
            });
        }
    }

    var post = function (req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        var pin = req.params.pin, value = req.body.val;
        console.log('pin: ' + pin);
        gpio.setup(pin, gpio.DIR_OUT, write);

        function write() {
            gpio.write(pin, value, function (err) {
                if (err) throw err;
                console.log('Written to' + pin);
                res.sendStatus(200);
            });
        }
    }
    var init = function (req, res) {
        var pin = req.params.pin;
        gpio.setup(pin, gpio.DIR_OUT, write);
    }
    return {
        post: post,
        get: get,
        init: init
    };
}