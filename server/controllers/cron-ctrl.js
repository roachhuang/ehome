'use strict';
var cron = require('crontab');
var request = require('request');

module.exports = function (xbee) {
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
            /*
            for( var i in jobs) {
                console.log('jobs' + job + '= ', job[i]);
            };
            */
            if (err) console.log(err);
            console.log(jobs);
            res.status(200).json({ jobs: jobs });
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
        var schedule = req.body.job, pin = req.body.pin, addr = req.body.addr;
        var job;
        if (pin[0] !== 'D') {
            //if (addr === null) {
            job = new LocalJob(pin);
        } else {
            // D0 ~ D7 on xbee
            job = new RemoteJob(pin, addr);
        }

        var cmd1 = job.cmdOn();
        var cmd0 = job.cmdOff();

        if (!req.body) {
            return res.sendStatus(400);
        }
        // set cron job on server
        cron.load(function (err, crontab) {
            // cmd, time, comment
            var job1 = crontab.create(cmd1, schedule.on);
            var job0 = crontab.create(cmd0, schedule.off);
            crontab.save(function (err, crontab) {
                res.sendStatus(200);
                console.log(err);
            });
        });
    }

    function LocalJob(pin) {
        this.pin = pin;
    }

    LocalJob.prototype.cmdOn = function () {
        return "echo '1' > /sys/class/gpio/gpio" + this.pin.toString() + '/value';
    };
    LocalJob.prototype.cmdOff = function () {
        return "echo '0' > /sys/class/gpio/gpio" + this.pin.toString() + '/value';
    };
    function RemoteJob(pin, addr) {
        this.pin = pin;
        this.addr = addr;
    }

    RemoteJob.prototype.cmdOn = function () {
        //var frameId = xbee.xbeeAPI.nextFrameId();
        var f = {
            type: xbee.C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            //id: frameId,
            command: this.pin,
            destination64: this.addr,
            commandParameter: [0x05]
        };
        f = xbee.xbeeAPI.buildFrame(f);
        var a = '';
        for (var i = 0; i < f.length; i += 2) {
            a = a.concat('\\x');
            a = a.concat(f.slice(i, i + 2));
        }
        return 'echo -en' + a + '> /dev/ttyAMA0';
        //return '/pi/home/bin/www/ehome/s.sh f1.txt';
    };

    RemoteJob.prototype.cmdOff = function () {
        var f = {
            type: xbee.C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            //id: frameId,
            command: this.pin,
            destination64: this.addr,
            commandParameter: [0x04]
        };
        f = xbee.xbeeAPI.buildFrame(f);
        var a = '';
        for (var i = 0; i < f.length; i += 2) {
            a = a.concat('\\x');
            a = a.concat(f.slice(i, i + 2));
        }
        return 'echo -en' + a + '> /dev/ttyAMA0';
    };

};


