(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('devicesCtrl', devicesCtrl);

    devicesCtrl.$inject = ['$scope', 'gpioService', 'deviceService'];
    function devicesCtrl($scope, gpioService, deviceService) {
        var vm = $scope;
        vm.iOHasInit = false;

        activate();

        ////////////////

        function activate() {
            // deviceService is a singleton
            var i, pin;

            vm.devices = deviceService;
            if (!vm.iOHasInit) {
                for (i in vm.devices) {
                    pin = vm.devices[i].pin;
                    gpioService.initIo(pin);
                }
                vm.IoHasInit = true;
            }
            setTimeout(function () {
                for (i in vm.devices) {
                    pin = vm.devices[i].pin;
                    gpioService.inPut(pin).then(function (value) {
                        vm.devices[i].status = value;
                    });
                    console.log(pin.toString() + ':' + vm.devices[i].status);
                }
            }, 500); // setInterval to .5s
        }

        vm.onOff = function (device) {
            // toogle btw 0 and 1
            device.status = device.status ^ 1;
            gpioService.outPut(device.status, device.pin);
        };

    }
})();