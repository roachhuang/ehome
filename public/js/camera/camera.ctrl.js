(function () {
	'use strict';

	angular
		.module('myApp')
		.controller('cameraCtrl', cameraCtrl);

	cameraCtrl.$inject = ['$http'];
	function cameraCtrl($http) {
		var vm = this;

		vm.snapShot = function () {
			return $http.get('/users/saveimage').then(function (res) {
				return res.data;
			});
		};

		activate();

		////////////////

		function activate() { }
	}
})();