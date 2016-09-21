(function () {
    'use strict';

    angular
        .module('myApp')
        .constant('cronUrl', 'http://192.168.1.199:3000/cron/')
        .controller('cronCtrl', cronCtrl);

    cronCtrl.$inject = ['$routeParams', 'gpio', '$http', 'cronUrl'];
    function cronCtrl($routeParams, gpio, $http, cronUrl) {
        var vm = this;
        /*
                $scope.cron = Cron.get({id: $routeParams.id});
                $scope.crons = Cron.query();
                cron.$save(cronjob);
                cron.$remove(id);
                cron.$update(cron);
        */
        activate();

        ////////////////
        var readCronJob = function () {
            $http.get(cronUrl + vm.selectedDevice.addr).then(function (res) {
                vm.cronJobs = res.data.jobs;
            });
        };

        function activate() {
            vm.cronJobs = [];
            gpio.getXbee().then(function (res) {
                var devices = res.data.xbee.devices;
                vm.selectedDevice = devices[$routeParams.deviceId];

                //read cronjobs from localstorage.

                //vm.selectedDevice.cronJobs = [];
                //itemName = vm.selectedDevice.name;
                //console.log(localStorage.getItem(itemName));
                //vm.cronJobs = JSON.parse(localStorage.getItem(itemName)) || [];

                // retrieve only the device's jobs
                $http.get(cronUrl + vm.selectedDevice.addr).then(function (res) {
                    vm.cronJobs = res.data.jobs;
                });
            });
            // vm.selectedDevice.cronJobs = JSON.parse(localStorage.getItem(itemName)) || {};
            vm.tmpJob = {};
            vm.myConfig = {
                options: {
                    allowMinute: false,
                    //allowWeek: false,
                    allowMonth: false,
                    allowYear: false
                }
            };
        }

        // data is from cron.html (tmpJob)
        vm.addJob = function (job) {
            //hmmm... do i really need parse and stringify???
            //var myJob = JSON.parse(JSON.stringify(job));
            // save to localstorage and call node cron
            //device = dev[vm.selectedDeviceId];
            //angular.extend(vm.selectedDevice.cronJobs[data.count], data);
            //vm.cronJobs.push(myJob);
            //localStorage.setItem(itemName, JSON.stringify(vm.cronJobs)); //JSON.stringify(job);
            //vm.tmpJob.on = vm.tmpJob.off = '';
            //vm.selectedDevice.saveJobs2LocalStorage();
            var data = { job: job, pin: vm.selectedDevice.pin };
            addCronTab(data, function (res) {
                readCronJob();
            });
        };

        vm.removeJob = function (id) {
            //vm.cronJobs.splice(vm.cronJobs.indexOf(job), 1);
            vm.cronJobs.splice(id, 1);
            //localStorage.setItem(itemName, JSON.stringify(vm.cronJobs)); //JSON.stringify(job);
            delCronTab(id, function (res) {
                readCronJob();
            });
            //var json = JSON.parse(localStorage[itemName]);
            //json.splice(json.indexOf(job), 1);
            //localStorage[itemName] = JSON.stringify(json);
        };

        vm.removeAllJobs = function () {
            removeAllCronJobs(function (err, data) {
                if (err) throw err;
                readCronJob();
            });
        };

        ///////////////////////////////////////////////////////////////////////////
        var removeAllCronJobs = function (cb) {
            return $http.delete('/cron/' + vm.selectedDevice.addr, null).success(function (data) {
                cb(null, data);
            })
                .error(function (err) {
                    cb(err);
                });
        };

        function addCronTab(data, cb) {
            var req = {
                method: 'POST',
                url: '/cron/' + vm.selectedDevice.addr,
                //transformRequest: transformRequestAsFormPost,
                data: data // to do: '1' or 1 or can use false
            };
            return $http(req).then(cb);
        }

        function delCronTab(id, cb) {
            return $http.delete('/cron/byId/' + id, null).then(cb);
        }
    }
})();