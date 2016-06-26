<<<<<<< HEAD
(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('devicesCtrl', devicesCtrl);

    devicesCtrl.$inject = ['$scope', 'gpioService', 'deviceService', '$http'];
    function devicesCtrl($scope, gpioService, deviceService, $http) {
        var vm = $scope;

        activate();

        ////////////////

        function activate() {
            // deviceService is a singleton
            var i, pin, gpioObj;
            vm.devices = deviceService;
            /*
            for (i in vm.devices) {
                pin = vm.devices[i].pin;
                if (localStorage.getItem(pin) === 'undefined') {
                    gpioService.getGpioObj(pin).then(function (res) {
                        vm.devices[i].gpioObj = res.data;
                        localStorage.setItem(pin, JSON.stringify(vm.devices[i].gpioObj));
                    });
                } else {
                    vm.devices[i].gpioObj = JSON.parse(localStorage.getItem(pin));
                }
            }
            */

            // read devices status
            //setTimeout(function () {
            for (i in vm.devices) {
                pin = vm.devices[i].pin;

                $http.get('/gpio/' + pin).success(function (data) {
                    vm.devices[i].status = data.value;
                    console.log(pin.toString() + ':' + vm.devices[i].status);
                });
            }
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
            gpioService.outPut(device.status, device.pin);
        };

    }
=======
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
            var i, pin, gpioObj;
            vm.devices = deviceService;
            for (i in vm.devices) {
                pin = vm.devices[i].pin;
                if (localStorage.getItem(pin) === 'undefined') {
                    gpioService.getGpioObj(pin).then(function (res) {
                        vm.devices[i].gpioObj = res.data;
                        localStorage.setItem(pin, JSON.stringify(vm.devices[i].gpioObj));
                    });
                } else {
                    vm.devices[i].gpioObj = JSON.parse(localStorage.getItem(pin));
                }
            }

            // read devices status
            setTimeout(function () {
                for (i in vm.devices) {
                    pin = vm.devices[i].pin;
                    gpioObj = vm.devices[i].gpioObj;
                    gpioService.inPut(pin, gpioObj).then(function (res) {
                        vm.devices[i].status = res.data.value;
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
>>>>>>> 0ec0a1cc276d68b06f8d88c593512420174f7f19
})();