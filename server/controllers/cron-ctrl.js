'use strict';
var cron = require('crontab');
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
        var job = req.body.job, pin = req.body.pin;
        var cmd1 = "echo '1' > /sys/class/gpio/gpio" + pin.toString() + '/value';
        var cmd0 = "echo '0' > /sys/class/gpio/gpio" + pin.toString() + '/value';

        if (!req.body) {
            return res.sendStatus(400);
        }

        console.log(job.on);

        // set cron job on server

        cron.load(function (err, crontab) {
            var job0 = crontab.create(cmd0, job.off);
            var job1 = crontab.create(cmd1, job.on);
            crontab.save(function(err, crontab){
                console.log(err);
            })
        })
        res.sendStatus(200);
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

