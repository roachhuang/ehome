'use strict';
var cron = require('crontab');
var request = require('request');

module.exports = function () {
    var crons = [];

    return {
        get: get,
        getById: getById,
        post: post,
        //put: put,
        delete: deleteById
    };

    function get(req, res) {
        cron.load(function (err, crontab) {
            var jobs = crontab.jobs();
            res.json(jobs);
        });
        //res.json(crons);
    }

    
    function getById(req, res) {
        var id = req.params.id;
        res.send(crons[id]);
    }
    /*
    function post(req, res) {
        crons.push(req.body);
        // convert array to json obj
        //res.status(201).send(JSON.stringify(crons));
        res.status(201).send('saved');

    }
    
    function put(req, res) {
        var id = req.params.id;
        crons[id] = req.body;
        res.json(crons);
    }
    */

    function deleteById(req, res) {
        var id = req.params.id.toString();
        //var cmd1 = "echo '1' > /sys/class/gpio/gpio" + pin.toString() + '/value';
        //var cmd0 = "echo '0' > /sys/class/gpio/gpio" + pin.toString() + '/value';

        cron.load(function (err, crontab) {
            // cmd, time, comment
            crontab.remove({ comment: /id+'off'/ });
            crontab.remove({ comment: /id+'on'/ });
        });
        // crons.splice(id, 1);
        res.status(204).send('removed');
    }

    function post(req, res) {
        var job = req.body.job, pin = req.body.pin, id = req.body.id.toString();
        var cmd1 = "echo '1' > /sys/class/gpio/gpio" + pin.toString() + '/value';
        var cmd0 = "echo '0' > /sys/class/gpio/gpio" + pin.toString() + '/value';

        if (!req.body) {
            return res.sendStatus(400);
        }

        // set cron job on server
        cron.load(function (err, crontab) {
            // cmd, time, comment
            var job0 = crontab.create(cmd0, job.off, id + 'off');
            var job1 = crontab.create(cmd1, job.on, id + 'on');
            crontab.save(function (err, crontab) {
                console.log(err);
            });
        });
        res.sendStatus(200);
    }
};

