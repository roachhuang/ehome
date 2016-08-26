(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('sensorsCtrl', sensorsCtrl);

    sensorsCtrl.$inject = ['$http'];
    function sensorsCtrl($http) {
        var vm = this;

        function readBatteryLvl() {
            angular.forEach(vm.sensors, function (sensor) {
                var cmdParm = [];
                return $http.get('/gpio/rmtAtCmd/' + sensor.addr + '/' + 'V').then(function (res) {
                    //sensor.battery = 1200 * (res.data.commandData.data[0] * 256 + res.data.commandData.data[1]) / 1024;
                    sensor.battery = 1024 * (res.data.commandData.data[0] * 256 + res.data.commandData.data[1]) + 600 / 1200;
                    sensor.battery = (sensor.battery / 1000).toFixed(2);
                    //console.info('voltage: ', voltage);
                });
            });
        }

        activate();

        function loadSensorObjs() {
            $http.get('/sensors').then(function (res) {
                vm.sensors = res.data.sensors;    // inside data there is an object sensors
                readBatteryLvl();
                console.log('c sensors: ', vm.sensors);
            });
        }
        function enableAllSensors() {
            var val = 1;
            angular.forEach(vm.sensors, function (sensor) {
                sensor.enable = val;
            });
            return $http.get('/sensors/ctrlAll/' + val).then(function (res) {
                // done
            });
        }
        function disableAllSensors() {
            var val = 0;
            angular.forEach(vm.sensors, function (sensor) {
                sensor.enable = val;
            });
            return $http.get('/sensors/ctrlAll/' + val).then(function (res) {
                // done
            });
        }

        vm.onExit = function () {
             var req = {
                method: 'POST',
                url: '/sensors/',
                //transformRequest: transformRequestAsFormPost,
                data: {sensors: vm.sensors} 
            };
            return $http(req);
        }          
        
        ////////////////

        function activate() {
            loadSensorObjs();
        }
    }
})();