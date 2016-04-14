angular.module("myApp")
    .controller("nasaCtrl", function ($scope, $http) {
        $scope.yahoo = {};
        $http.get('/api/yahoo').then(function (res) {
            $scope.yahoo = res.data.query.results.channel;
        });

        $scope.apod = {};
        $http.get('/api/apod').then(function (res) {
            $scope.apod = res.data;
        });
    })