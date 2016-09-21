(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('devicesCtrl', devicesCtrl);

    devicesCtrl.$inject = ['$scope', 'gpio', '$timeout', 'toastr'];
    //function devicesCtrl($scope, gpio, deviceService, $http, $timeout) {
    function devicesCtrl($scope, gpio, $timeout, toastr) {
        var vm = $scope;

        activate();

        ////////////////
        function activate() {

            //vm.devices = deviceService;
            // deviceService is a singleton
            // this is very important to know return from  nodejs is res.status(200).send({value: value})
            gpio.getXbee().then(function (res) {
                vm.devices = res.data.xbee.devices;
            });

            $timeout(function () {
                angular.forEach(vm.devices, function (device) {
                    gpio.inPut(device.pin, device.addr).then(function (res) {
                        device.status = res.data.value;
                    }).catch(function (e) {
                        device.error = e;
                        console.log('unable to get dev status');
                    });
                })
            }, 500);

            //$timeout(function () {
            //$http.get('/gpio/' + device.pin + '/' + device.addr).success(function (data) {
            //    device.status = data.value;
            //    console.log(device.pin + ': ' + device.status + ' val: ' + data.value);
            //});
            //}, 500);
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
            gpio.outPut(device.status, device.pin, device.addr);
        };

        vm.ctrlAll = function (devices, value) {
            angular.forEach(devices, function (device) {
                device.error = null;
                $timeout(function () {
                    gpio.outPut(value, device.pin, device.addr).success(function (data) {
                        device.status = value;
                    })
                        .error(function (err, status) {
                            device.error = err;
                        });
                }, 500);
            });
        };

        vm.updateDeviceName = function (device, index) {
            device.name = 's'.concat(device.name);
            gpio.rmtAtCmd(device.addr, 'NI', device.name).then(function (res) {
                //console.log('dev name changed');
                toastr.success(device.name, '更名成功');
                //vm.sensors[index].name = sensor.name;
            });
            gpio.updateDeviceName(index, device);
        };
    }
})();