
(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('nasaCtrl', nasaCtrl);

    nasaCtrl.$inject = ['$http'];
    function nasaCtrl($http) {
        var vm = this;

        activate();

        ////////////////
        //todo: i should del this ctrl as them can be inherited from app.js
        function activate() {
            vm.yahoo = {};
            $http.get('/api/yahoo').then(function (res) {
                if (res.data.query.results != null) {
                    vm.yahoo = res.data.query.results.channel;
                    //console.log(vm.yahoo.item.forcast);
                }
            });

            vm.apod = {};
            $http.get('/api/apod').then(function (res) {
                vm.apod = res.data;
            });
        }
    }
})();
