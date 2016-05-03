(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('cronCtrl', cronCtrl);

    cronCtrl.$inject = ['$scope', '$routeParams', 'deviceService'];
    function cronCtrl($scope, $routeParams, deviceService) {
        var vm = $scope;

        activate();

        ////////////////

        function activate() {
            vm.count = 0;
            vm.selectedDevice = deviceService[$routeParams.deviceId];

            vm.selectedDevice.cronJobs = JSON.parse(localStorage.getItem(vm.selectedDevice.name));
            vm.tempJob = {
                cnt: 0,
                on: '',
                off: ''
            }

            console.log(vm.selectedDevice);
        }
        vm.saveEdit = function (dev, count) {
            // save to localstorage and call node cron
            //device = dev[vm.selectedDeviceId];
            dev.saveCronData(count);
        };
        vm.cancelEdit = function (device) {
            vm.count = 0;
        };
        vm.addNextCronjob = function (dev, data) {
            data.cnt = vm.count;
            dev.cronJobs.push(data);
            vm.count = vm.count + 1;
        };
    }
})();