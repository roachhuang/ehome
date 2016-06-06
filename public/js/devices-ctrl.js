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
            var i, pin;
            vm.devices = deviceService;
            for (i in vm.devices) {
                pin = vm.devices[i].pin;
                gpioService.initIo(pin);
            }

            setTimeout(function () {
                for (i in vm.devices) {
                    pin = vm.devices[i].pin;
                    gpioService.inPut(pin).then(function (value) {
                        vm.devices[i].status = value;
                    });
                    console.log(pin.toString() + ':' + vm.devices[i].status);
                }
            }, 100); // setInterval to .5s
        }

        vm.onOff = function (device) {
            // toogle btw 0 and 1
            device.status = device.status ^ 1;
            gpioService.outPut(device.status, device.pin);
        };

    }
})();