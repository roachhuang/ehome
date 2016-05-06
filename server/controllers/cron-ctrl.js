'use strict';
var CronJob = require('cron').CronJob;
var http = require('http');

module.exports = function () {
    var set = function (req, res) {
        if (!req.body) return res.sendStatus(400);
        var pin = req.params.cronJob;
        var val = req.body.val;
        var pin = req.body.pin;
        try {
            var job = new CronJob(cronJob, function () {
                var options = {
                    host: 'localhost',
                    path: '/gpio/:' + pin.toString,
                    port: 3000,
                    method: 'PUT'
                }
                http.request(options, callback).end();
            }, null, true)
        } catch (ex) {
            console.log("cron pattern not valid");
        }
        response.on('end' function() {
            console.log('gpio end');
        });

        return {
            set: set
        }
    }
}