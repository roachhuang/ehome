(function() {
'use strict';

    angular
        .module('myApp')
        .controller('cronCtrl', cronCtrl);

    cronCtrl.$inject = ['$scope', '$routeParams'];
    function cronCtrl($scope, $routeParams) {
        var vm = $scope;
        vm.count=0;

        activate();

        ////////////////

        function activate() {
            vm.selectedDevice = JSON.parse($routeParams.device);
            console.log($scope.selectedDevice.name);
        }
    }
})();