(function () {
	'use strict';

	angular
		.module('myApp')
		.controller('widgetsCtrl', widgetsCtrl);

	widgetsCtrl.$inject = ['$http'];
	function widgetsCtrl($http) {
		var vm = this;
		vm.sensors = [];
		vm.anyAlarm = false;
		readSensor();

		////////////////
		function readSensor() {
			$http.get('/sensors/').then(function (res) {
                vm.sensors = res.data.sensors;    // inside data there is an object sensors
				var i;
				for (i = 0; i < vm.sensors.length; i++) {
					vm.anyAlarm = vm.sensors[i].status || vm.anyAlarm;
				}
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


