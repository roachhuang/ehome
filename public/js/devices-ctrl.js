(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('devicesCtrl', devicesCtrl);

    devicesCtrl.$inject = ['$scope', 'deviceService'];
    function devicesCtrl($scope, deviceService) {
        var vm = $scope;

        activate();

        ////////////////

        function activate() {
            vm.devices = deviceService;
<<<<<<< HEAD
            vm.devices.forEach(function (entry) {
                console.log(entry);
                entry.status = entry.getStatus();
                console.log(entry.status);
=======
            vm.devices.forEach(function (device) {
                device.status = device.getStatus();
>>>>>>> bc92548e6bf64d09827d9d04f82841f1e1461df4
            });
        }
    }
})();