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
            outPut: outPut,
            getGpioObj: getGpioObj
        };

        return service;

        //////////////////////////////////////////////////
        //  GPIO class

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


        function inPut(pin) {
            var def = $q.defer();

            $http.get('/gpio/' + pin).success(function (data) {

                service.value = data.value;
                def.resolve(data.value);
            }).error(function () {
                def.reject('failed to get IO status');
            });
            return def.promise;

        }

    }
})();