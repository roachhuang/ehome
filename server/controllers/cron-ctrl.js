'use strict';
var cron = require('crontab');
var request = require('request');

module.exports = function () {
    var crons = [];

    return {
        get: get,
        //getById: getById,
        post: post,
        //put: put,
        deleteById: deleteById,
        deleteAll: deleteAll
    };

    function get(req, res) {
        cron.load(function (err, crontab) {
            var jobs = crontab.jobs();
            for (var prop in jobs) {
                console.log('jobs' + prop + '=' + jobs[prop]);
            }
            res.json(200, { jobs: jobs });
        });
        //res.json(crons);
    }

    /*
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
            res.send(200);
        });
    }

    function deleteById(req, res) {
        // each job has 2 cmd - on and off
        var id = req.params.id * 2;
        console.log('id:' + id);
        cron.load(function (err, crontab) {
            var jobs = crontab.jobs();
            crontab.remove(jobs[id]);
            id += 1;
            console.log('id:' + id);
            crontab.remove(jobs[id]);
            // crons.splice(id, 1);
            /*
                        for (var prop in jobs) {
                            if (jobs.hasOwnProperty(prop))
                                console.info('value: '+jobs[prop]); // value
                            console.info('key: '+prop); // key name
                        }

                        */
            crontab.save(function (err, crontab) {
                console.log(err);
                res.status(204).send('removed');
            });
        });
    }


    // save a cron job
    function post(req, res) {
        var job = req.body.job, pin = req.body.pin;
        var cmd1 = "echo '1' > /sys/class/gpio/gpio" + pin.toString() + '/value';
        var cmd0 = "echo '0' > /sys/class/gpio/gpio" + pin.toString() + '/value';

        if (!req.body) {
            return res.sendStatus(400);
        }
        // set cron job on server
        cron.load(function (err, crontab) {
            // cmd, time, comment
            var job1 = crontab.create(cmd1, job.on);
            var job0 = crontab.create(cmd0, job.off);
            crontab.save(function (err, crontab) {
                res.sendStatus(200);
                console.log(err);
            });
        });
    }
};


