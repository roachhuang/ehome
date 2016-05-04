(function() {
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
         }
    }
})();