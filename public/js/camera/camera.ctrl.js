(function () {
	'use strict';

	angular
		.module('myApp')
		.controller('cameraCtrl', cameraCtrl);

	cameraCtrl.$inject = ['$http'];
	function cameraCtrl($http, dialogBox) {
		var vm = this;

		vm.snapShot = function () {
			vm.btn1State = 'disabled';
			vm.msg1='Saving Image...';
			return $http.get('/users/saveimage').then(function (res) {
				vm.btn1State='';
				vm.msg1 ='存到 Goolge Drive';
				return res.data;
			});
		};

		vm.saveVideo = function () {
			vm.btn2State = 'disabled';
			vm.msg2='Saving Video...';
			return $http.get('/users/saveVideo').then(function (res) {
				vm.btn2State='';
				vm.msg2 ='存 video 到 Goolge Drive';
				return res.data;
			});
		};

		activate();

		////////////////

		function activate() {
			vm.msg1 ='存 image 到 Goolge Drive';
			vm.msg2 ='存 video 到 Goolge Drive';
			vm.btn1State='';
			vm.btn2State='';
		 }
	}
})();