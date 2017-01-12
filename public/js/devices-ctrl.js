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
            vm.devices = [];
            //vm.devices = deviceService;
            // deviceService is a singleton
            // this is very important to know return from  nodejs is res.status(200).send({value: value})
            gpio.getXbee().then(function (res) {
                vm.devices = res.data.xbee.devices;
                angular.forEach(vm.devices, function (device) {
                    device.name = device.name.slice(1);
                });
            });

            $timeout(function () {
                angular.forEach(vm.devices, function (device) {
                    gpio.inPut(device.pin, device.addr).then(function (res) {
                        device.status = res.data.value;
                    }).catch(function (e) {
                        device.error = e;
                        console.log('unable to get dev status', e);
                    });
                });
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

        vm.updateDeviceName = function (newName, index) {
            //var xbeeName;
            //if (oldName !== 'null') {
            //xbeeName = 'p'.concat(newName);
            //} else {
            //    newName = null;
            //}
            /*
            gpio.rmtAtCmd(device.addr, 'NI', newName).then(function (res) {
                // Extract from position 1, and to the end
                toastr.success(device.name, '更名成功');
                //vm.sensors[index].name = sensor.name;
            });
            */
            gpio.updateDeviceName(newName, index).then(function (res) {
                toastr.success('更名成功');
            })
            .catch(function (data) {
                 console.error('err: ', data); 
            });    
        };

        vm.delDevice = function (index) {
            //let xbeeName = 'p'.concat(deviceName);
            gpio.delDevice(index).then(function (res) {
                toastr.success('Delete 成功');
            })
            .catch(function (err) {
                 console.log('err: ', err); 
            });    
        };
    }
})();