(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('devicesCtrl', devicesCtrl);

    devicesCtrl.$inject = ['$scope', 'gpioService', 'deviceService', '$window'];
    function devicesCtrl($scope, gpioService, deviceService, $window) {
        var vm = $scope;

        activate();

        ////////////////

        function activate() {
            // deviceService is a singleton
            var i, pin;
            vm.devices = deviceService;     

            // read devices status
            setTimeout(function () {
                for (i in vm.devices) {
                    pin = vm.devices[i].pin;                    
                    gpioService.inPut(pin).then(function (value) {
                        vm.devices[i].status = value;
                    });
                    console.log(pin.toString() + ':' + vm.devices[i].status);
                }
            }, 200); // setInterval to .5s

            $window.onbeforeunload = vm.onExit;
        }

        vm.onExit = function () {
            for (var i in vm.devices) {
                localStorage.removeItem(vm.devices[i].pin);
            }
        };

        vm.onOff = function (device) {
            // toogle btw 0 and 1
            device.status = device.status ^ 1;
            gpioService.outPut(device.status, device.pin);
        };

    }
})();