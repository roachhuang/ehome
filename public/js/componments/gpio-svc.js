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
        function getGpioObj(pin) {
            $http.get('/gpio/getGpioObj/' + pin).then(function (res) {
                return res.data;
            //}, function (res) {
            //    return res.status;
            });
        }
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

            $http.get('/gpio/' + pin + '/' + gpioObj).success(function (res) {
                service.value = res.value;
                def.resolve(res.value);
            }).error(function () {
                def.reject('failed to get IO status');
            });
            return def.promise;
        }
        /*
        $http.get('/gpio/' + pin).then(function (res) {
            return res.data.value;
        });
*/
    }
})();