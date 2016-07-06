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
			// todo: close serialport, release GPIO ports, 
		}

		activate();

		////////////////
		function activate() {
			// hasAuthorized variable is inherited from app.js
			if (vm.hasAuthorized === false) {
				alert("not logon, please log on");
				// if use $http.get('/auth/google), we get same origin error
				$window.location = $window.location.protocol + "//" + $window.location.host + $window.location.pathname + "auth/google";
			}
			
			// read sensors data every 3s
			stop = $interval(function () {
				vm.anyAlarm = false;
				$http.get('/sensors').then(function (res) {
					vm.sensors = res.data.sensors;    // inside data there is an object sensors
					var i;
					for (i in vm.sensors) {
						vm.anyAlarm = vm.sensors[i].status || vm.anyAlarm;
					}
				}, function (res) {
					console.log(res.err);
				});
			}, 3 * 1000);	// 3s
			
/*
			vm.$on('$locationChangeStart', function (event, next, current) {
				//alert("locationChange event..");
				$interval.cancel(stop);
			});
*/
			vm.$on('$destroy', function () {
				// Make sure that the interval is destroyed too
				if (angular.isDefined(stop)) {
					$interval.cancel(stop);
					stop = undefined;
				}
			});

			$window.onbeforeunload = vm.onExit;
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


