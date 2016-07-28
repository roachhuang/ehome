/* the url with "/" prefix is relative to the domain, without the "/" prefix it will be relative
 ** to the main ("index.html") page or base url (if you use location in the html5 mode).
 */
angular.module('myApp')
	.config(function ($routeProvider, $locationProvider, $httpProvider) {
		// base is set to public bah?
		$locationProvider.html5Mode({ enabled: true, requireBase: false });
		$routeProvider
			.when('/', {
				controller: 'widgetsCtrl',
				templateUrl: '/js/widgets.html'
			})
			.when('/camera', {
				templateUrl: '/js/camera/cameraview.html',
				controller: 'cameraCtrl as vm'
				/*
	controller: 'cameraCtrl',
	resolve: {
			// I will cause a 1 second delay
			delay: function($q, $timeout) {
			var delay = $q.defer();
			$timeout(delay.resolve, 1000);
			return delay.promise;
			}
	}
	*/
			})
			.when('/nasa', {
				templateUrl: '/js/nasa.html',
				controller: 'nasaCtrl'
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
				controller: 'cronCtrl'
			})
			.when('/sensors', {				
				templateUrl: '/js/sensors/sensors.html',
				controller: 'sensorsCtrl as vm'
			})
			.when('/login', {
				// set cronjob by devId
				templateUrl: '../js/login/login.html',
				controller: 'loginCtrl'
			})
			.when('/about', {
				templateUrl: '/views/about.html'
			})
			.otherwise({
				controller: 'widgetsCtrl as vm',
				templateUrl: '/js/widgets.html'
			});
	});