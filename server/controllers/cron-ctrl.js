'use strict';
var CronJob = require('cron').CronJob;
var request = require('request');

module.exports = function () {

    return {
        set: set
    };

    //////////////////////////////////////////////////////////////////////////
    function set(req, res) {
        var cronTime, val = req.body.val, pin = req.body.pin;

        if (!req.body) {
            return res.sendStatus(400);
        }
        var cronTime = '0 '.concat(req.body.cron);

        console.log(cronTime);

        // set cron job on server
        try {
            var job = new CronJob(cronTime, function () {
                //runTask(pin, val);
                console.log(Date.now());
                //res.sendStatus(200);
            }, null, true);
        } catch (ex) {
            console.log('invalid pattern');
            res.sendStatus(500);
       }
/*
        var cb = function (res) {
            res.on('end', function () {
                console.log('gpio end');
            });
        };
*/
    }

    //////////////////////////////////////////////////////////////////////////
    function runTask(pin, val) {
        var options = {
            url: 'http://localhost:3000/gpio/:' + pin,
            method: 'POST',
            json: { val: val }
        };

        // Start the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                // Print out the response body
                console.log(body);
            }
        });
    }
};

