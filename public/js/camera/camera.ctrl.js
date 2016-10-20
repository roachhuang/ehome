(function () {
	'use strict';

	angular
		.module('myApp')
		.controller('cameraCtrl', cameraCtrl);

	cameraCtrl.$inject = ['$http', 'dialogBox'];
	function cameraCtrl($http, dialogBox) {
		var vm = this;

		vm.snapShot = function () {
			return $http.get('/users/saveimage').then(function (res) {
				return res.data;
			});
		};

		vm.saveVideo = function () {
			dialogBox.confirmRemove().then(function () {
				return $http.get('/users/saveVideo').then(function (res) {
					return res.data;
				});
			});
		};

		activate();

		////////////////

		function activate() { }
	}
})();