(function() {
'use strict';

	angular
		.module('myApp')
		.controller('widgetsCtrl', widgetsCtrl);

	widgetsCtrl.$inject = ['$scope'];
	function widgetsCtrl($scope) {
		var vm = $scope;
		
		activate();

		////////////////

		function activate() {
			vm.hasLoggedIn = false;
		 }
	}
})();