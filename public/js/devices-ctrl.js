(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('devicesCtrl', devicesCtrl);

    devicesCtrl.$inject = ['$scope', 'gpioService', 'deviceService'];
    function devicesCtrl($scope, gpioService, deviceService) {
        var vm = $scope;

        activate();

        ////////////////

        function activate() {
            // deviceService is a singleton
            vm.devices = deviceService;
            var i;
            //setInterval(function () {
                for (i in vm.devices) {
                    vm.devices[i].status = vm.pinStatus(vm.devices[i].pin);
                }
            //}, 500); // setInterval to .5s

        }

        vm.onOff = function (device) {
            // toogle btw 0 and 1
            device.status = device.status ^ 1;
            gpioService.outPut(device.status, device.pin);
        };
        vm.pinStatus = function (pin) {
            // return 0 or 1
            return gpioService.inPut(pin);
        };
    }
})();