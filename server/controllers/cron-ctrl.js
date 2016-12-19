'use strict';
var cron = require('crontab');
var fs = require('fs');

module.exports = function (xbee) {
    var crons = [];

    function get(req, res) {
        var addr = req.params.addr;
        cron.load(function (err, crontab) {
            var j = [], dow, h, m;
            var jobs = crontab.jobs({ comment: addr });
            for (var i = 0; i < jobs.length; i++) {
                dow = jobs[i].dow().render();
                h = jobs[i].hour().render();
                m = jobs[i].minute().render();
                j.push({ dow: dow, h: h, m: m });
            }

            if (err) throw err;
            res.status(200).json({
                jobs: j
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
        var addr = req.params.addr;
        cron.load(function (err, crontab) {
            if (err) throw err;
            //var jobs = crontab.jobs();
            crontab.remove({ comment: addr });
            //crontab.reset();
            crontab.save(function (err, crontab) {
                if (err) throw err;
            });
            res.sendStatus(200);
        });
    }

    function deleteById(req, res) {
        // each job has 2 cmd - on and off
        //var id = req.params.id * 2;
        var id = req.params.id;
        cron.load(function (err, crontab) {
            var jobs = crontab.jobs();
            crontab.remove(jobs[parseInt(id)]);
            //id += 1;
            //console.log('id:' + id);
            //crontab.remove(jobs[id]);
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
                res.sendStatus(204).send('removed');
            });
        });
    }

    // save a cron job
    function post(req, res) {
        var schedule = req.body.job, pin = req.body.pin;
        var addr = req.params.addr;
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
        cmd0 = job.cmd('0');
        //console.log('cmd0', cmd0);
        // set cron job on server
        cron.load(function (err, crontab) {
            // cmd, time, comment=addr
            var job1 = crontab.create(cmd1, schedule.on, addr);
            var job0 = crontab.create(cmd0, schedule.off, addr);
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
    /*
    LocalJob.prototype.cmdOff = function () {
        return "echo '0' > /sys/class/gpio/gpio" + this.pin.toString() + '/value';
    };
*/
    function RemoteJob(pin, addr) {
        this.pin = pin;
        this.addr = addr;
    }

    RemoteJob.prototype.cmd = function (val) {
        var vm = this;
        //var frameId = xbee.xbeeAPI.nextFrameId();
        //var f = new Buffer([0x7e, 0x00, 0x10, 0x17, 0x05, 0x00, 0x13, 0xa2, 0x00]);
        fs.stat(vm.addr + vm.pin + val, function (err, stat) {
            if (err == null) {
                console.log('File exists');
            } else if (err.code === 'ENOENT') {
                // file does not exist
                var f = buildFrame(vm.addr, vm.pin, val);
                fs.writeFile(vm.addr + vm.pin + val, '\'' + f + '\'' + '\n', function (err) {
                    if (err) throw err;
                });

            } else {
                console.log('Some other error: ', err.code);
            }
        });

        //console.log('a: ', 'echo -en ' + a + ' > /dev/ttyAMA0');
        //return 'sudo stty - F / dev/ttyAMA0 9600; echo -en ' + '\'' + a + '\'' + ' > /dev/ttyAMA0';
        //echo -en "\x7e\x00\x10\x17\x05\x00\x13\xa2\x00\x40\xeb\x55\x6c\xff\xfe\x02\x44\x30\x04\xcb" > /dev/ttyAMA0
        var fullPath = '/home/pi/';
        return fullPath + 's.sh ' + fullPath + this.addr + this.pin + val;
    };

    function buildFrame(addr, pin, val) {
        var f = {
            type: xbee.C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: addr,
            destination16: 'fffe', // optional, "fffe" is default
            remoteCommandOptions: 0x02,
            //id: frameId,
            command: pin,
            commandParameter: (val === '1') ? [0x05] : [0x04],
        };

        // it returns a buffer
        var b = xbee.xbeeAPI.buildFrame(f);
        console.log(xbee.xbeeAPI.parseFrame(b));
        f = b.toString('hex');

        var a = '';
        for (var i = 0; i < f.length; i += 2) {
            a = a.concat('\\x' + f.substr(i, 2));
        }
        return a;
    }

    return {
        get: get,
        //getById: getById,
        post: post,
        //put: put,
        deleteById: deleteById,
        deleteAll: deleteAll
    }
};