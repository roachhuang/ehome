(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('devicesCtrl', devicesCtrl);

    devicesCtrl.$inject = ['$scope', 'gpioService', 'deviceService', '$http', '$timeout'];
    function devicesCtrl($scope, gpioService, deviceService, $http, $timeout) {
        var vm = $scope;

        activate();

        ////////////////

        function activate() {
            // deviceService is a singleton
            var i, pin, addr;
            vm.devices = deviceService;

            $http.post('/gpio', vm.devices, { header: {'content-Type': 'application/JSON'}}).then(function (res) {
                for (i in vm.devices) {
                    $timeout(function () {
                        pin = vm.devices[i].pin;
                        addr = vm.devices[i].addr;
                        $http.get('/gpio/' + pin + '/' + addr).success(function (data) {
                            vm.devices[i].status = data.value;
                            console.log(pin.toString() + ':' + vm.devices[i].status);
                        });
                    }, 500);
                }
            });

            // read devices status
            //setTimeout(function () {

            //}, 200); // setInterval to .5s

            //$window.onbeforeunload = vm.onExit;
        }
        /*
                vm.onExit = function () {
                    for (var i in vm.devices) {
                        localStorage.removeItem(vm.devices[i].pin);
                    }
                };
        */
        vm.onOff = function (device) {
            // toogle btw 0 and 1
            device.status = device.status ^ 1;
            gpioService.outPut(device.status, device.pin, device.addr);
        };

        vm.allOn = function (devices) {
            for (var i in devices) {
                $timeout(function () {
                    gpioService.outPut(1, devices[i].pin, devices[i].addr);
                }, 500);

            }
        };
        vm.allOff = function (devices) {
            for (var i in devices) {
                $timeout(function () {
                    gpioService.outPut(0, devices[i].pin, devices[i].addr);
                }, 500);
            }
        };
    }
})();