(function () {
	'use strict';

	angular
		.module('myApp')
		.controller('widgetsCtrl', widgetsCtrl);

	widgetsCtrl.$inject = ['$scope', '$http', '$window', '$interval'];
	function widgetsCtrl($scope, $http, $window, $interval) {
		// use $scope so we can inherit $scope from mainCtrl
		var vm = $scope, stop;
		vm.sensors = [];
		vm.onExit = function () {
			// close serialport, release GPIO ports,
		};

		activate();

		function getSensorObjs() {
			return $http.get('/sensors').then(function (res) {
				vm.sensors = res.data.sensors;    // inside data there is an object sensors
			})
		}
		function readSensorsStatus() {
			angular.forEach(vm.sensors, function (sensor) {
				vm.anyAlarm = sensor.status || vm.anyAlarm;
				var cmdParm = [];
				return $http.get('/gpio/rmtAtCmd/' + sensor.addr + '/' + 'V').then(function (res) {
					sensor.battery = (res.data.commandData.data[0] * 256 + res.data.commandData.data[1]) / 1024;
					//console.info('voltage: ', voltage);
				})
			})
		}
		////////////////
		function activate() {
			// hasAuthorized variable is inherited from app.js
			if (vm.hasAuthorized === false) {
				alert('not logon, please log on');
				// if use $http.get('/auth/google), we get same origin error
				$window.location = $window.location.protocol + "//" + $window.location.host + $window.location.pathname + "auth/google";
			}
			socket.on('intruder', function(data){
				vm.anyAlarm = data;
			});
			/* read sensors data every 3s
			stop = $interval(function () {
				vm.anyAlarm = false;
				getSensorObjs().then(readSensorsStatus);
			}, 3 * 1000);
			
			vm.$on('$destroy', function () {
				// Make sure that the interval is destroyed too
				if (angular.isDefined(stop)) {
					$interval.cancel(stop);
					stop = undefined;
				}
			});
			$window.onbeforeunload = vm.onExit;
			*/
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


