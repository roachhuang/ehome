(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('settingsCtrl', settingsCtrl);

    settingsCtrl.$inject = ['$scope', 'deviceService'];
    function settingsCtrl($scope, deviceService) {
        var vm = $scope;

        activate();

        ////////////////

        function activate() {
            vm.devices = deviceService;
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