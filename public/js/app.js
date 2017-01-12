
(function () {
    'use strict';

    angular  
        .module('myApp', ['ngRoute', 'angular-cron-jobs', 'app.gpio', 'app.sensor', 'app.modal', 'toastr', 'ui.bootstrap'])      
        .controller('mainCtrl', mainCtrl);

    // mainCtrl.$inject = ['$scope', '$http', '$route', '$routeParams', '$location'];
    mainCtrl.$inject = ['$scope', '$http', '$location'];
    function mainCtrl($scope, $http, $location) {
        var vm = $scope;        
        //vm.apod = {}, vm.yahoo = {};
        //vm.devices = [];

        activate();

        ////////////////

        function activate() {
            /*
            vm.$route = $route;
            vm.$location = $location;
            vm.$routeParams = $routeParams;
            */
            hasAuthorized();

            $http.get('/api/yahoo').then(function (res) {
                vm.yahoo = res.data.query.results.channel;
            }).catch(function (e) {
                console.log(e);
            });

            $http.get('/api/apod').then(function (res) {
                vm.apod = res.data;
            }).catch(function (e) {
                console.log(e);
            });          
        }

        function hasAuthorized() {
            //$http.get('/users/google').then(function (res) {
            $http.get('/users/token').then(function (res) {
                if (res.data.token != null) {
                    vm.hasAuthorized = true;
                } else {
                    vm.hasAuthorized = false;
                }
            }).catch(function (e) {
                console.log(e);
            });
        }        
    }
})();



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