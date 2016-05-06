(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('cronCtrl', cronCtrl);

    cronCtrl.$inject = ['$scope', '$routeParams', 'deviceService'];
    function cronCtrl($scope, $routeParams, deviceService) {
        var vm = $scope;
        var itemName;

        activate();

        ////////////////

        function activate() {
            vm.tmpJob = {
                count: 0,
                on: '',
                off: ''
            };
            vm.tmpJob.count = 0;
            vm.myConfig = {
                options: {
                    allowMinute: false,
                    //allowWeek: false,
                    allowMonth: false,
                    allowYear: false
                }
            };
            //selected device for setting up cronjob

            vm.selectedDevice = deviceService[$routeParams.deviceId];
            //vm.selectedDevice.cronJobs = [];
            itemName = vm.selectedDevice.name;
            // save all to local and read all from local
            vm.selectedDevice.cronJobs = JSON.parse(localStorage.getItem(itemName)) || {};
            //vm.selectedDevice.cronJobs = JSON.parse(localStorage.getItem(vm.selectedDevice.name));
            console.log(vm.selectedDevice);

        }

        vm.saveEdit = function (data) {
            // save to localstorage and call node cron
            //device = dev[vm.selectedDeviceId];
            angular.extend(vm.selectedDevice.cronJobs[data.count], data);
            vm.selectedDevice.saveCronData();
        };
        vm.cancelEdit = function (device) {
            //vm.count = 0;
        };
        vm.addNextCronJob = function (data) {
            if (data.count < 6) {
                vm.selectedDevice.cronJobs[data.count] = vm.selectedDevice.cronJobs[data.count] || {};
                // cannot use objA = objB in this case coz objA will point to objB           
                angular.extend(vm.selectedDevice.cronJobs[data.count], data);
                vm.selectedDevice.saveCronData();
                vm.tmpJob.count++;
            } else {
                console.error(data.count);    // need to take care
            }
        };

    }
})();