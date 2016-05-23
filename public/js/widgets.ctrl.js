(function () {
	'use strict';

	angular
		.module('myApp')
		.controller('widgetsCtrl', widgetsCtrl);

	widgetsCtrl.$inject = ['$http'];
	function widgetsCtrl($http) {
		var vm = this;
		vm.sensors = [];
		var i = readSensor();

		////////////////
		function readSensor() {
			$http.get('/sensors/').then(function (res) {
                vm.sensors = res.data.sensors;    // inside data there is an object sensors
				return (vm.sensors.window.status === true);
            }, function (res) {
				console.log(res.err);
			});
		}


	}
})();

		/*
		vm.anyAlarm = function () {
			vm.anyAlarm = false;
			readSensor();
			for (var key in vm.sensors) {
				if (!vm.sensors.hasOwnProperty(key)) {
					continue;
				}
				var obj = vm.sensors(key);
				vm.anyAlarm = vm.anyAlarm || obj.status;
			}
			return vm.anyAlarm;
		};
		*/


