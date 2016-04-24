angular.module('myApp')
	.controller('cameraCtrl', function ($scope, $http, $window) {
		$http.get('/api/url').then(function (res) {
			var url = res.data;
			$window.open(url, 'Please sign in with Google", "width=500px,height:700px');
		});

		$scope.snapShot = function () {
			$http.get('/api/saveimage').then(function (res) {
				console.log('img captured');
			});
		};
	});