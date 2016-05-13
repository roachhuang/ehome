'use strict';
var CronJob = require('cron').CronJob;
var request = require('request');

module.exports = function () {

    return {
        set: set
    };

    //////////////////////////////////////////////////////////////////////////
    function set(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        var cronJob = req.body.cron, val = req.body.val, pin = req.body.pin;

        // set cron job on server
        try {
            var job = new CronJob(cronJob, function () {
                runTask(pin, val);
                console.log('task ran');
            }, null, true);
        } catch (ex) {
            console.log('cron pattern not valid', cronJob);
        }

        var cb = function (res) {
            res.on('end', function () {
                console.log('gpio end');
            });
        };
    };

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

