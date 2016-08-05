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
                    sensor.battery = 1200 * (res.data.commandData.data[0] * 256 + res.data.commandData.data[1]) / 1024;
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
        ////////////////

        function activate() {
            loadSensorObjs();
        }
    }
})();