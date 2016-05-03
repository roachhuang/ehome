(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$scope', 'deviceService'];
    function SettingsController($scope, deviceService) {
        var vm = $scope;

        activate();

        ////////////////

        function activate() {
            vm.devices = deviceService;
            //angular.copy(deviceService, vm.devices);
            vm.myConfig = {
                options: {
                    allowMinute: false,
                    //allowWeek: false,
                    allowMonth: false,
                    allowYear: false
                }
            };
        }
    }
})();