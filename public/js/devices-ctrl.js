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
            vm.devices = deviceService;
            // deviceService is a singleton
            // this is very important to know return from  nodejs is res.status(200).send({value: value})
            angular.forEach(vm.devices, function (device) {
                gpioService.inPut(device.pin, device.addr).then(function (data) {
                    device.status = data;
                }).catch(function (){
                    console.log('unable to get dev status');
                });
                //$timeout(function () {
                //$http.get('/gpio/' + device.pin + '/' + device.addr).success(function (data) {
                //    device.status = data.value;
                //    console.log(device.pin + ': ' + device.status + ' val: ' + data.value);
                //});
                //}, 500);
                //$window.onbeforeunload = vm.onExit;
            });
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

        vm.ctrlAll = function (devices, value) {
            angular.forEach (devices, function(device) {
                $timeout(function () {
                    gpioService.outPut(value, device.pin, device.addr);
                }, 500);
            });
        };     
    }
})();