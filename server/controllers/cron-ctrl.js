'use strict';
var cron = require('crontab');
//var request = require('request');
var util = require('util');

module.exports = function (xbee) {
    var crons = [];

    function get(req, res) {
        cron.load(function (err, crontab) {
            var jobs = crontab.jobs();
            /*
            for( var i in jobs) {
                console.log('jobs' + job + '= ', job[i]);
            };
            */
            if (err) console.log(err);
            console.log(util.inspect(jobs[0]));
            //console.log(util.inspect(jobs.CronJob.hour));
            res.status(200).json({
                jobs: jobs
            });
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
            if (err) throw err;
            var jobs = crontab.jobs();
            crontab.remove(jobs);
            //crontab.reset();
            crontab.save(function (err, crontab) {
                if (err) throw err;
            });
            res.sendStatus(200);
        });
    }

    function deleteById(req, res) {
        // each job has 2 cmd - on and off
        var id = req.params.id * 2;       
        cron.load(function (err, crontab) {
            var jobs = crontab.jobs();
            crontab.remove(jobs[id]);
            id += 1;
            //console.log('id:' + id);
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
        var schedule = req.body.job,
            pin = req.body.pin,
            addr = req.body.addr;
        if (!req.body) {
            return res.sendStatus(400);
        }
        var job;
        if (pin[0] !== 'D') {
            //if (addr === null) {
            job = new LocalJob(pin);
        } else {
            // D0 ~ D7 on xbee
            job = new RemoteJob(pin, addr);
        }

        var cmd1 = job.cmd('1');
        //console.log('cmd1', cmd1);
        // if not calling twice, checksum for cmd0 will be the same as cmd1. strange!
        var cmd0 = job.cmd('0');
        var cmd0 = job.cmd('0');
        //console.log('cmd0', cmd0);
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

    /////////////////////////////////////////////////////////////////////////////////
    function LocalJob(pin) {
        this.pin = pin;
    }

    LocalJob.prototype.cmd = function (val) {
        return "echo " + val + " > /sys/class/gpio/gpio" + this.pin.toString() + '/value';
    };
    LocalJob.prototype.cmdOff = function () {
        return "echo '0' > /sys/class/gpio/gpio" + this.pin.toString() + '/value';
    };

    function RemoteJob(pin, addr) {
        this.pin = pin;
        this.addr = addr;
    }

    RemoteJob.prototype.cmd = function (val) {
        //var frameId = xbee.xbeeAPI.nextFrameId();
        //var f = new Buffer([0x7e, 0x00, 0x10, 0x17, 0x05, 0x00, 0x13, 0xa2, 0x00]);
        var f = {
            type: xbee.C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: this.addr,
            destination16: "fffe", // optional, "fffe" is default
            remoteCommandOptions: 0x02,
            //id: frameId,
            command: this.pin,
            commandParameter: (val === "1") ? [0x05] : [0x04],
        };

        // it returns a buffer
        var b = xbee.xbeeAPI.buildFrame(f);
        console.log(xbee.xbeeAPI.parseFrame(b));
        f = b.toString('hex');

        var a = '';
        for (var i = 0; i < f.length; i += 2) {
            a = a.concat('\\x' + f.substr(i, 2));
        }
        //console.log('a: ', 'echo -en ' + a + ' > /dev/ttyAMA0');
        return 'echo -en ' + '\'' + a + '\'' + ' > /dev/ttyAMA0';

        //echo -en "\x7e\x00\x10\x17\x05\x00\x13\xa2\x00\x40\xeb\x55\x6c\xff\xfe\x02\x44\x30\x04\xcb" > /dev/ttyAMA0
        //return 's.sh f.txt'

        //return 'echo -en ' + apiFrame.toString() + ' > /dev/ttyAMA0';
        //return '/pi/home/bin/www/ehome/s.sh f1.txt';
    };

    return {
        get: get,
        //getById: getById,
        post: post,
        //put: put,
        deleteById: deleteById,
        deleteAll: deleteAll
    };

}