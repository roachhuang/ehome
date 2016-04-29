'use strict';
var CronJob = require('cron').CronJob;

module.exports = function (cron, task) {
    var setCron = function () {
        try {
            new CronJob(cron, function () {
                // to do
            }, null, true, 'Taiwan')
        } catch (ex) {
            console.log("cron pattern not valid");
        }
        return {
            setCron: setCron
        }
    }
}