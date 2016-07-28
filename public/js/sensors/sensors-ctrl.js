(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('sensorsCtrl', sensorsCtrl);

    sensorsCtrl.$inject = ['$http'];
    function sensorsCtrl($http) {
        var vm = this;

        activate();
        function loadSensorObjs() {
            return $http.get('/sensors').then(function (res) {
                vm.sensors = res.data.sensors;    // inside data there is an object sensors
            })
        }
        ////////////////

        function activate() {
            loadSensorObjs();
        }
    }
})();