(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('cronCtrl', cronCtrl);

    cronCtrl.$inject = ['$scope', '$routeParams', 'deviceService'];
    function cronCtrl($scope, $routeParams, deviceService) {
        var vm = $scope, itemName;
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
            itemName = vm.selectedDevice.name;
            console.log(localStorage.getItem(itemName));
            vm.cronJobs = JSON.parse(localStorage.getItem(itemName)) || [];
            //$scope.getJobs();
            // vm.selectedDevice.cronJobs = JSON.parse(localStorage.getItem(itemName)) || {};
            vm.tmpJob = {};
            //vm.tmpJob.count = 0;
            vm.myConfig = {
                options: {
                    allowMinute: false,
                    //allowWeek: false,
                    allowMonth: false,
                    allowYear: false
                }
            };
            //selected device for setting up cronjob
            console.log(vm.selectedDevice);
        }

        // data is from cron.html (tmpJob)
        vm.addJob = function (job) {
            var myJob = JSON.parse(JSON.stringify(job));
            // save to localstorage and call node cron
            //device = dev[vm.selectedDeviceId];
            //angular.extend(vm.selectedDevice.cronJobs[data.count], data);
            vm.cronJobs.push(myJob);
            localStorage.setItem(itemName, JSON.stringify(vm.cronJobs)); //JSON.stringify(job);
            //vm.tmpJob.on = vm.tmpJob.off = '';
            //vm.selectedDevice.saveJobs2LocalStorage();
            //callServerCron(job);
        };

        vm.removeJob = function (job) {
            vm.cronJobs.splice(vm.cronJobs.indexOf(job), 1);
            
            localStorage.setItem(itemName, JSON.stringify(vm.cronJobs)); //JSON.stringify(job);
            
            //var json = JSON.parse(localStorage[itemName]);
            //json.splice(json.indexOf(job), 1);         
            //localStorage[itemName] = JSON.stringify(json);
        };

        vm.addNextCronJob = function (data) {
            if (data.count < 6) {
                vm.selectedDevice.cronJobs[data.count] = vm.selectedDevice.cronJobs[data.count] || {};
                // cannot use objA = objB in this case coz objA will point to objB
                angular.extend(vm.selectedDevice.cronJobs[data.count], data);
                vm.selectedDevice.saveJobs2LocalStorage();
                vm.tmpJob.count++;
                //callServerCron(data);
            } else {
                console.error(data.count);    // need to take care
            }
        };

        /*
        function callServerCron(job) {
            var req = {
                method: 'POST',
                url: '/cron',
                //transformRequest: transformRequestAsFormPost,
                data: { cron: job.on, val: 1 } // to do: '1' or 1 or can use false
            };
            // job: on
            $http(req).then(function (data) {
                console.log(data);
            });
            // job: off
            req.data = { cron: job.off, val: '0' };
            $http(req).then(function (data) {
                console.log(data);
            });
        }
        */
    }
})();