angular.module('myApp')
    .controller('nasaCtrl', function ($scope, $http) {
        var vm = this;
        $scope.yahoo = {};
        $http.get('/api/yahoo').then(function (res) {
            $scope.yahoo = res.data.query.results.channel;
            console.log($scope.yahoo.item.forcast);
        });

        $scope.apod = {};
        $http.get('/api/apod').then(function (res) {
            $scope.apod = res.data;
        });
    });
