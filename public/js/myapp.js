angular.module("myApp", ['ngSanitize', 'ngRoute'])

.controller("widgetCtrl", function ($scope) {
		$scope.widget = {};
	})
	.controller("smartHomeCtrl", function ($scope) {
		$scope.eHome = {};
	})
	.controller("mainCtrl", function ($scope, $http, $route, $routeParams, $location) {
		$scope.$route = $route;
		$scope.$location = $location;
		$scope.$routeParams = $routeParams;
		$scope.yahoo = {};
		$http.get('/api/yahoo').then(function (res) {
			$scope.yahoo = res.data.query.results.channel;
		});

		$scope.apod = {};
		$http.get('/api/apod').then(function (res) {
			$scope.apod = res.data;
		});
	})

.controller("nasaCtrl", function ($scope, $http) {
	$scope.apod = {};
	$http.get('/api/apod').then(function (res) {
		$scope.apod = res.data;
	});
})

.controller("cameraCtrl", function ($scope, $http, $window) {
	$http.get("/api/url").then(function (res) {
		var url = res.data;
		$window.open(url, "Please sign in with Google", "width=500px,height:700px");
	});

	$scope.snapShot = function () {
		$http.get('/api/saveimage').then(function (res) {
			console.log('img captured');
		});
	}
})

/* not support yet
	var video,
		vendorUrl = window.URL || window.webitURL;
	
	var p = navigator.mediaDevices.getUserMedia({ audio: false, video: true });

	p.then(function(mediaStream) {
  	var video = document.querySelector('video');
  	video.src = window.URL.createObjectURL(mediaStream);
  	video.onloadedmetadata = function(e) {
    // Do something with the video here.
    video.play();
  };
});

p.catch(function(err) { console.log(err.name); }); // always check for errors at the end.
/*
	// Capture video
	navigator.getMedia(
		{video: true,
		 audio: false
	}, function(stream) {
		video.src = vendorUrl.createObjectURL(stream);
		video.play();
	}, function(err) {
		console(err);
		// err.code;
	});

    //$scope.params = $routeParams;	// params can be camerid or eles.
    $scope.camera = {};
    $http.get('http://ubuy.asuscomm.com:8080/image.jpg').then(function(res) {
        $scope.camera.img = res.data;
    });
    $http.get('//ubuy.asuscomm.com:3000/api/webcam').then(function(res) {
    //$http.get('http://ubuy.asuscomm.com:8080/video.cgi').then(function(res) {
        $scope.camera.cgi = res.data;
    });
*/

.config(function ($routeProvider, $locationProvider, $httpProvider) {
	/* Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common = 'Content-Type: application/json';
    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    */
	$routeProvider
		.when('/', {
			controller: 'widgetCtrl'
			, templateUrl: './views/widget.html'
		})
		.when('/cameraView', {
			templateUrl: './views/cameraview.html'
			, controller: 'cameraCtrl'
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
			templateUrl: './views/nasa.html'
			, controller: 'nasaCtrl'
		})
		.when('/smarthome', {
			templateUrl: './views/smarthome.html'
			, controller: 'smartHomeCtrl'
		})
		.otherwise({
			controller: 'widgetCtrl'
			, templateUrl: './views/widgets.html'
		});
});