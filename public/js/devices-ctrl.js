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
            var i, pin;

            setTimeout(function () {
                for (i in vm.devices) {
                    pin = vm.devices[i].pin;
                    vm.devices[i].status = pinStatus(pin);
                    console.log(pin.toString() + ':' + vm.devices[i].status);
                }
            }, 500); // setInterval to .5s

        }

        vm.onOff = function (device) {
            // toogle btw 0 and 1
            device.status = device.status ^ 1;
            gpioService.outPut(device.status, device.pin);
        };
        //////////////////
        function pinStatus(pin) {
            var value;
            // return 0 or 1
            value =  gpioService.inPut(pin);
            return value;
        };
    }
})();