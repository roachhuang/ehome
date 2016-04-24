angular.module('myApp')
.controller('nasaCtrl', function ($scope, $http) {
    $scope.apod = {};
    $http.get('/api/apod').then(function (res) {
        $scope.apod = res.data;
    });
})

