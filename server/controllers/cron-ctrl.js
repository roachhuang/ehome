'use strict';
var CronJob = require('cron').CronJob;
var request = require('request');

module.exports = function () {
    var crons = [];

    return {
        set: set,
        get: get,
        getById: getById,
        post: post,
        put: put,
        delete: deleteById
    };

    function get(req, res) {
        res.json(crons);
    }
    function getById(req, res) {
        var id = req.params.id;
        res.send(crons[id]);
    }
    function post(req, res) {
        crons.push(req.body);
        // convert array to json obj
        //res.status(201).send(JSON.stringify(crons));
        res.status(201).send('saved');

    }
    // update
    function put(req, res) {
        var id = req.params.id;
        crons[id] = req.body;
        res.json(crons);
    }
    function deleteById(req, res) {
        var id = req.params.id;
        crons.splice(id, 1);
        res.status(204).send('removed');
    }

    //////////////////////////////////////////////////////////////////////////
    function set(req, res) {
        var cronTime, val = req.body.val, pin = req.body.pin;

        if (!req.body) {
            return res.sendStatus(400);
        }
        cronTime = '0 '.concat(req.body.cron);

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

