(function () {
	'use strict';

	angular
		.module('myApp')
		.controller('widgetsCtrl', widgetsCtrl);

	widgetsCtrl.$inject = ['$scope', '$http'];
	function widgetsCtrl($scope, $http) {
		var vm = $scope;

		////////////////

		function readSensor() {
			$http.get('/sensors/').then(function (res) {
                return res.data.sensors;    // inside data there is an object sensors
            });
		}
		function AnyAlarm() {
			vm.anyAlarm = false;
			vm.sensors = readSesnors();
			for (key in vm.sensors) {
				if (!vm.sensors.hasOwnProperty(key)) {
					continue;
				}
				var obj = vm.sensor(key);
				vm.anyAlarm = vm.anyAlarm || obj.status;
			}
			return vm.anyAlarm;
		}
	}
})();

