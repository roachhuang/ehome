(function () {
	'use strict';

	angular
		.module('myApp')
		.controller('cameraCtrl', cameraCtrl);

	cameraCtrl.$inject = ['$http'];
	function cameraCtrl($http) {
		var vm = this;

		vm.snapShot = function () {
			$http.get('/users/saveimage').then(function (res) {
				console.log('img captured');
			});
		};

		activate();

		////////////////

		function activate() { }
	}
})();