(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('cronCtrl', cronCtrl);

    cronCtrl.$inject = ['$scope', '$routeParams', 'deviceService', '$http'];
    function cronCtrl($scope, $routeParams, deviceService, $http) {
        var vm = $scope;
        /*
                $scope.cron = Cron.get({id: $routeParams.id});
                $scope.crons = Cron.query();
                cron.$save(cronjob);
                cron.$remove(id);
                cron.$update(cron);
        */
        activate();

        ////////////////

        function activate() {
            vm.cronJobs = [];
            //read cronjobs from localstorage.
            vm.selectedDevice = deviceService[$routeParams.deviceId];
            //vm.selectedDevice.cronJobs = [];
            //itemName = vm.selectedDevice.name;
            //console.log(localStorage.getItem(itemName));
            //vm.cronJobs = JSON.parse(localStorage.getItem(itemName)) || [];

            // retrieve only the device's jobs
            readCronJob();        
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
        var readCronJob = function () {
            $http.get('/cron/' + vm.selectedDevice.addr).then(function (res) {
                vm.cronJobs = res.data.jobs;
            });
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
            var data = { job: job, pin: vm.selectedDevice.pin, addr: vm.selectedDevice.addr };
            addCronTab(data, function (res) {
                readCronJob();
            });
        };

        vm.removeJob = function (id) {
            //vm.cronJobs.splice(vm.cronJobs.indexOf(job), 1);
            vm.cronJobs.splice(id, 1);
            //localStorage.setItem(itemName, JSON.stringify(vm.cronJobs)); //JSON.stringify(job);
            delCronTab(id);
            readCronJob();
            //var json = JSON.parse(localStorage[itemName]);
            //json.splice(json.indexOf(job), 1);
            //localStorage[itemName] = JSON.stringify(json);
        };

        vm.deleteAllJobs = function () {
            return $http.delete('/cron/' + vm.selectedDevice.addr, null).then(function (res) {
                //localStorage.removeItem(itemName);
                return res.status;
            });
        };

        function addCronTab(data, cb) {
            var req = {
                method: 'POST',
                url: '/cron' / + addr,
                //transformRequest: transformRequestAsFormPost,
                data: data // to do: '1' or 1 or can use false
            };
            return $http(req).then(cb);
        }

        function delCronTab(id) {
            var req = {
                method: 'DELETE',
                url: '/cron/' + id,
            };
            $http(req).then(function (res) {
                return res.status;
            });
        }
    }
})();