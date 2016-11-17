(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('settingsCtrl', settingsCtrl);

    settingsCtrl.$inject = ['$scope', 'gpio'];
    function settingsCtrl($scope, gpio) {
        var vm = $scope;

        activate();

        ////////////////

        function activate() {
            gpio.getXbee().then(function (res) {
                vm.devices = res.data.xbee.devices;
                angular.forEach(vm.devices, function (device) {
                    device.name = device.name.slice(1);
                });
            });
            //angular.copy(deviceService, vm.devices);
            /* move to cron-ctrl.js
            vm.myConfig = {
                options: {
                    allowMinute: false,
                    //allowWeek: false,
                    allowMonth: false,
                    allowYear: false
                }
            };
            */
        }
    }
})();