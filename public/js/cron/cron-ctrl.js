(function() {
'use strict';

    angular
        .module('myApp')
        .controller('cronCtrl', cronCtrl);

    cronCtrl.$inject = ['$scope', '$routeParams', 'deviceService'];
    function cronCtrl($scope, $routeParams, deviceService) {
        var vm = $scope;
        vm.selectedDeviceId = null;
        activate();

        ////////////////

        function activate() {
            vm.count = 0;
            //vm.selectedDeviceId = $routeParams.deviceId;
            // selected device
            vm.device = deviceService[$routeParams.deviceId];
            console.log(vm.device);
        }
        vm.saveEdit = function (dev, count) {
            // save to localstorage and call node cron      
            //device = dev[vm.selectedDeviceId];
            dev.saveCronData(count);
        };
        vm.cancelEdit = function (device) {
            vm.count = 0;
        };
        vm.NewCronjob = function() {
            vm.count = vm.count + 1;
        };
    }
})();