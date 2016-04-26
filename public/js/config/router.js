/* the url with "/" prefix is relative to the domain, without the "/" prefix it will be relative
 ** to the main ("index.html") page or base url (if you use location in the html5 mode).
 */
angular.module('myApp')
	.config(function ($routeProvider, $locationProvider, $httpProvider) {
		$routeProvider
			.when('/', {
				controller: 'widgetsCtrl',
				templateUrl: '../js/widgets.html'
			})
			.when('/cameraView', {
				templateUrl: '../js/camera/cameraview.html',
				controller: 'cameraCtrl'
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
				templateUrl: '../js/nasa.html',
				controller: 'nasaCtrl'
			})
			.when('/smarthome', {
				templateUrl: '../js/ehome.html',
				controller: 'eHomeCtrl'
			})
			.when('/settings', {
				templateUrl: '../views/settings.html',
				controller: 'SettingsController'
			})
			.otherwise({
				controller: 'widgetsCtrl',
				templateUrl: '../js/widgets.html'
			});
	});