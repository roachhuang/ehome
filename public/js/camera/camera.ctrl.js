angular.module('myApp')
	.controller('cameraCtrl', function ($scope, $http, $window) {
		/*
		$http.get('/api/url').then(function (res) {
			$window.open(url, 'Please sign in with Google", "width=500px,height:700px');
			var url = res.data;			
		});
		*/
		$scope.snapShot = function () {			
			$http.get('/users/saveimage').then(function (res) {
				console.log('img captured');
			});
		};
	});