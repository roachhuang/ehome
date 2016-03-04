angular.module("myApp", ['ngSanitize', 'ngRoute'])

.controller("mainCtrl", function($scope, $http, $route, $routeParams, $location) {  
	$scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.yahoo = {};  
    $http.get('//ubuy.asuscomm.com:3000/api/yahoo').then(function(res) {
    	$scope.yahoo = res.data.query.results.channel;
    });
})

.controller("nasaCtrl", function($scope, $http) {
    $scope.apod = {};   
    $http.get('//ubuy.asuscomm.com:3000/api/apod').then(function(res) {
    	$scope.apod = res.data;
    });
})  

.controller("cameraCtrl", function($scope, $http, $routeParams) {
	$scope.params = $routeParams;	// params can be camerid or eles.
    $scope.camera = {};   
    $http.get('http://192.168.1.252/image.jpg').then(function(res) {
       	$scope.camera.img = res.data;
    });
    $http.get('http://192.168.1.252/video.cgi').then(function(res) {
       	$scope.camera.cgi = res.data;
    });
})

.config(function($routeProvider, $locationProvider, $httpProvider) {
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
  	$routeProvider
   	.when('/cameraView', {
    	templateUrl: './views/cameraview.html',
    	controller: 'cameraCtrl'
    	/*
    	controller: 'cameraCtrl',
    	resolve: {
      		// I will cause a 1 second delay
      		delay: function($q, $timeout) {
        		var delay = $q.defer();
        		$timeout(delay.resolve, 1000);
        		return delay.promise;
      		}
    	}
    	*/
	})
  	.when('/nasa', {
    	templateUrl: './views/nasa.html',
    	controller: 'nasaCtrl'
  	})
  	.otherwise({
  		controller: 'nasaCtrl',
  		templateUrl: './views/nasa.html'
  	});
});