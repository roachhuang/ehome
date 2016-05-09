'use strict';
var CronJob = require('cron').CronJob;
var request = require('request');

module.exports = function () {

    var set = function (req, res) {
        if (!req.body) return res.sendStatus(400);
        var cronJob = req.body.cronJob;

        // set cron job on server
        try {
            var job = new CronJob(cronJob, function () {
                //runTask(req);
                console.log('to do: run task');
            }, null, true)
        } catch (ex) {
            console.log("cron pattern not valid");
        }

        cb = function (res) {
            response.on('end', function () {
                console.log('gpio end');
            });
        }
    }

    return {
        set: set
    }
    //////////////////////////////////////////////////////////////////////////
    function runTask(req) {
        var val = req.body.val;
        var pin = req.body.pin;

        var options = {
            url: 'http://localhost:3000/gpio/:' + pin.toString,
            method: 'PUT',
            json: { val: val }
        }

        // Start the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
        })
    };
}

