(function () {
    'use strict';

    angular
        .module('app.gpio', [])
        .factory('gpioService', gpioService);
    gpioService.$inject = ['$http', '$q'];
    function gpioService($http, $q) {
        var service = {
            value: '',
            inPut: inPut,
            outPut: outPut
        };

        return service;

        //////////////////////////////////////////////////
        //  GPIO class

        // remote or local pin control
        function outPut(value, pin) {
            var val = value;
            var req = {
                method: 'POST',
                url: '/gpio/' + pin,
                //transformRequest: transformRequestAsFormPost,
                data: { val: val }
            };
            $http(req).then(function (data) {
                console.log(data);
            });
        }

        function inPut(pin, gpioObj) {
            var def = $q.defer();
            $http.get('/gpio/' + pin + '/' + gpioObj).success(function (data) {

                service.value = data.value;
                def.resolve(data.value);
            }).error(function () {
                def.reject('failed to get IO status');
            });
            return def.promise;

        }
    }
})();