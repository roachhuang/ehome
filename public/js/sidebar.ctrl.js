angular.module('myApp')
    .controller('nasaCtrl', function ($scope, $http) {
        var vm = this;
        vm.yahoo = {};
        $http.get('/api/yahoo').then(function (res) {
            if (res.data.query.results != null){
                vm.yahoo = res.data.query.results.channel;
                //console.log(vm.yahoo.item.forcast);
            }
        });

        vm.apod = {};
        $http.get('/api/apod').then(function (res) {
            vm.apod = res.data;
        });
    });
