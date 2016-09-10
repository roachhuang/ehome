/* the url with "/" prefix is relative to the domain, without the "/" prefix it will be relative
 ** to the main ("index.html") page or base url (if you use location in the html5 mode).
 */
(function () {
	'use strict';

	angular.module('myApp')
		//.constant('baseUrl', 'http://localhost:3000/')
		//.constant('baseUrl', 'http://192.168.1.199/')
		//.constant('baseUrl', 'http://192.168.1.199:3000/')
		.config(config);
	config.$inject = ['$routeProvider', '$locationProvider'];

	function config($routeProvider, $locationProvider) {
		// base is set to public bah?
		$locationProvider.html5Mode({enabled: true, requireBase: false});
		$routeProvider
			.when('/', {
				//controller: 'widgetsCtrl',
				templateUrl: '/views/widgets.html'
			})			
			.when('/camera', {
				templateUrl: '/js/camera/cameraview.html',
				controller: 'cameraCtrl as vm'	
			})
			.when('/nasa', {
				templateUrl: '/views/nasa.html',
				//controller: 'nasaCtrl as vm'
			})
			.when('/devivesControl', {
				templateUrl: '/js/devices-ctrl.html',
				controller: 'devicesCtrl'
			})
			.when('/settings', {
				templateUrl: '/js/cron/settings.html',
				controller: 'settingsCtrl'
			})
			.when('/settings/:deviceId', {
				// set cronjob by devId
				templateUrl: '/js/cron/cron.html',
				controller: 'cronCtrl as vm'
			})
			.when('/sensors', {
				templateUrl: '/js/sensors/sensors.html',
				controller: 'sensorsCtrl'
			})
			.when('/login', {
				// set cronjob by devId
				templateUrl: '/views/login/login.html',
				controller: 'loginCtrl'
			})
			.when('/about', {
				templateUrl: '/views/about.html'
			})
			.when('/pair', {
				templateUrl: '/js/pair/pair.html',
				controller: 'pairController as vm'
			})	
			.otherwise({
				redirectTo: '/'
			});
	}
})();