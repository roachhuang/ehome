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
            var i, pin, gpioObj;
            vm.devices = deviceService;
            for (i in vm.devices) {
                pin = vm.devices[i].pin;
                vm.devices[i].gpioObj = JSON.parse(localStorage.getItem(pin));
                if (vm.devices[i].gpioObj === undefined) {
                    vm.devices[i].gpioObj = gpioService.getPinInObj(pin);
                    localStorage.setItem(pin, JSON.stringify(vm.devices[i].gpioObj));
                }
            }

            // read devices status
            setTimeout(function () {
                for (i in vm.devices) {
                    pin = vm.devices[i].pin;
                    gpioObj = vm.devices[i].gpioObj;
                    gpioService.inPut(pin, gpioObj).then(function (value) {
                        vm.devices[i].status = value;
                    });
                    console.log(pin.toString() + ':' + vm.devices[i].status);
                }
            }, 200); // setInterval to .5s

            $window.onbeforeunload = vm.onExit;
        }

        vm.onExit = function () {
            for (i in vm.devices) {
                localStorage.removeItem(vm.devices[i].pin);
            }
        }

        vm.onOff = function (device) {
            // toogle btw 0 and 1
            device.status = device.status ^ 1;
            gpioService.outPut(device.status, device.pin);
        };

    }
})();