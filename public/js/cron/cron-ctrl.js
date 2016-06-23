(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('cronCtrl', cronCtrl);

    cronCtrl.$inject = ['$scope', '$routeParams', 'deviceService', '$http'];
    function cronCtrl($scope, $routeParams, deviceService, $http) {
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
            //vm.cronJobs = $http.get('/cron');
            //$scope.getJobs();
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
            //selected device for setting up cronjob
            console.log(vm.selectedDevice);
        }

        // data is from cron.html (tmpJob)
        vm.addJob = function (job) {
            //hmmm... do i really need parse and stringify???
            var myJob = JSON.parse(JSON.stringify(job));
            // save to localstorage and call node cron
            //device = dev[vm.selectedDeviceId];
            //angular.extend(vm.selectedDevice.cronJobs[data.count], data);
            vm.cronJobs.push(myJob);
            localStorage.setItem(itemName, JSON.stringify(vm.cronJobs)); //JSON.stringify(job);
            //vm.tmpJob.on = vm.tmpJob.off = '';
            //vm.selectedDevice.saveJobs2LocalStorage();
            addCronTab(job, vm.selectedDevice.pin);
        };

        vm.removeJob = function (id) {
            //vm.cronJobs.splice(vm.cronJobs.indexOf(job), 1);
            vm.cronJobs.splice(id, 1);
            localStorage.setItem(itemName, JSON.stringify(vm.cronJobs)); //JSON.stringify(job);
            delCronTab(id);
            //var json = JSON.parse(localStorage[itemName]);
            //json.splice(json.indexOf(job), 1);
            //localStorage[itemName] = JSON.stringify(json);
        };

        vm.deleteAllJobs = function(){
            $http.delete('/cron', null).then(function(res){
                console.log(res.data);
                localStorage.removeItem(itemName);
            });
        };

        function addCronTab(job, pin) {
            var req = {
                method: 'POST',
                url: '/cron',
                //transformRequest: transformRequestAsFormPost,
                data: { job: job, pin: pin } // to do: '1' or 1 or can use false
            };
            $http(req).then(function (data) {
                console.log(data);
            });
        }

        function delCronTab(id) {
            var req = {
                method: 'DELETE',
                url: '/cron/' + id,
            };
            $http(req).then(function (data) {
                console.log(data);
            });
        }
    }
})();