(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('sensorsCtrl', sensorsCtrl);

    sensorsCtrl.$inject = ['$scope', '$http', '$location', 'gpio'];
    function sensorsCtrl($scope, $http, location, gpio) {
        var vm = $scope;

        function readBatteryLvl() {
            angular.forEach(vm.sensors, function (sensor) {
                var cmdParm = [];
                return $http.get('/gpio/rmtAtCmd/' + sensor.addr + '/' + 'V' + '/' + 'null').then(function (res) {
                    //sensor.battery = 1200 * (res.data.commandData.data[0] * 256 + res.data.commandData.data[1]) / 1024;
                    sensor.battery = 1024 * (res.data.commandData.data[0] * 256 + res.data.commandData.data[1]) + 600 / 1200;
                    sensor.battery = (sensor.battery / 1000).toFixed(2);
                    //console.info('voltage: ', voltage);
                });
            });
        }

        activate();

        function writeStatus2Server() {
            var req = {
                method: 'POST',
                url: '/sensors/',
                //transformRequest: transformRequestAsFormPost,
                data: { sensors: vm.sensors }
            };
            return $http(req);
        }

        function loadSensorObjs() {
            gpio.atCmd('ND', 'null');

            $http.get('/sensors').then(function (res) {
                vm.sensors = res.data.sensors;    // inside data there is an object sensors
                //readBatteryLvl();
                console.log('c sensors: ', vm.sensors);
            });
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

        vm.$on('$locationChangeStart', function () {
            writeStatus2Server();
        });

        vm.updateSensorName = function (sensor, index) {
            sensor.name = 's'.concat(sensor.name);
            gpio.rmtAtCmd(sensor.addr, 'NI', sensor.name).then(function (res) {
                console.log('name changed');
                //vm.sensors[index].name = sensor.name;
            });
            var req = {
                method: 'PUT',
                url: '/sensors/' + index,
                //transformRequest: transformRequestAsFormPost,
                data: sensor
            };
            return $http(req);
        };

        ////////////////

        function activate() {

            loadSensorObjs();
        }
    }
})();