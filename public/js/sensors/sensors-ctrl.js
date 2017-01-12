(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('sensorsCtrl', sensorsCtrl);

    sensorsCtrl.$inject = ['$scope', '$http', '$location', 'gpio', 'sensorSvc', 'toastr'];
    function sensorsCtrl($scope, $http, location, gpio, sensorSvc, toastr) {
        var vm = $scope;
        /*
                function readBatteryLvl() {
                    angular.forEach(vm.sensors, function (sensor) {
                        var cmdParm = [];
        
                        return $http.get('/gpio/rmtAtCmd/' + sensor.addr + '/' + 'V' + '/' + 'null').then(function (res) {
                            //sensor.battery = 1200 * (res.data.commandData.data[0] * 256 + res.data.commandData.data[1]) / 1024;
                            sensor.battery = res.data.commandData.data[0] * 256 + res.data.commandData.data[1];
                            sensor.battery = (sensor.battery / 1000).toFixed(2);
                            //console.info('voltage: ', voltage);
                        });
                    });
                }
        */
        activate();

        function writeStatus2Server() {
            sensorSvc.setSensorAvailability(vm.sensors).then(function () {
                console.log('成功');
            }).catch(function (err) {
                console.log('err: ', err);
            });
        }

        function loadSensorObjs() {
            gpio.atCmd('ND', 'null');
            sensorSvc.getSensors().then(function (res) {
                vm.sensors = res.data.sensors;    // inside data there is an object sensors
                angular.forEach(vm.sensors, function (sensor) {
                    sensor.name = sensor.name.slice(1);
                });
                console.log('c sensors: ', vm.sensors);
            }).catch(function (err) {
                console.log('err: ', err);
            });
            // don't know why. if no dealy here, will get http.get timout error.
            //setTimeout(readBatteryLvl, 5000);

            /* return a stream
            var s = $http.get('/sensors');
            s.on('error', function (err) {
                console.log(err);
            });
            s.on('end', readBatteryLvl);
            s.on('data', function (chunk) {
                vm.sensors = chunk;    // inside data there is an object sensors
                angular.forEach(vm.sensors, function (sensor) {
                    sensor.name = sensor.name.slice(1);
                });
            });
            */
        }

        vm.setSensorsStatus = function (val) {
            angular.forEach(vm.sensors, function (sensor) {
                sensor.enable = val;
            });
            writeStatus2Server();
            //return $http.get('/sensors/ctrlAll/' + val).then(function (res) {
            // done
            //});
        };
        /*
        vm.disableAllSensors = function () {
            var val = false;
            angular.forEach(vm.sensors, function (sensor) {
                sensor.enable = val;
            });
            writeStatus2Server();
            //return $http.get('/sensors/ctrlAll/' + val).then(function (res) {
            // done
            //});
        };
        */
        vm.$on('$locationChangeStart', function () {
            writeStatus2Server();
        });

        vm.delSensor = function (index) {
            //let xbeeName = 'p'.concat(deviceName);
            sensorSvc.delSensor(index).then(function (res) {
                toastr.success('Delete 成功');
            }).catch(function (err) {
                console.log('err: ', err);
            });
        };

        vm.updateSensorName = function (newName, index) {
            sensorSvc.updateSensorName(newName, index).then(function (res) {
                toastr.success('更名成功');
            }).catch(function (data) {
                console.error('err: ', data);
            });
        };

        ////////////////

        function activate() {
            loadSensorObjs();
        }
    }
})();