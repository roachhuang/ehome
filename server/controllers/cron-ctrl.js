'use strict';
var cron = require('crontab');
var request = require('request');

module.exports = function () {
    var crons = [];

    return {
        get: get,
        post: post,
        deleteById: deleteById,
        deleteAll: deleteAll
    };

    function get(req, res) {
        cron.load(function (err, crontab) {
            var jobs = crontab.jobs();
            res.json(200, { jobs: jobs });
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
    function deleteAll(req, res) {
        cron.load(function (err, crontab) {
            var jobs = crontab.jobs();
            crontab.remove(jobs);
            crontab.save(function (err, crontab) {
                console.log(err);
                res.status(204).send('all jobs deleted');
            });
        });
    }

    function deleteById(req, res) {
        var id = req.params.id.toString();
        //var cmd1 = "echo '1' > /sys/class/gpio/gpio" + pin.toString() + '/value';
        //var cmd0 = "echo '0' > /sys/class/gpio/gpio" + pin.toString() + '/value';

        cron.load(function (err, crontab) {
            // cmd, time, comment
            var comment = id + 'off';
            crontab.remove({ comment: comment });
            crontab.remove({ comment: /id+'on'/ });
            crontab.save(function (err, crontab) {
                console.log(err);
                res.status(204).send('removed');
            });
        });
        // crons.splice(id, 1);
    }

    function post(req, res) {
        var job = req.body.job, pin = req.body.pin, id = req.body.id;
        console.log(id);
        id = id.toString();
        var cmd1 = "echo '1' > /sys/class/gpio/gpio" + pin.toString() + '/value';
        var cmd0 = "echo '0' > /sys/class/gpio/gpio" + pin.toString() + '/value';

        if (!req.body) {
            return res.sendStatus(400);
        }
        console.log(id + 'off');
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

