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
            initIo: initIo
        };

        return service;

        //////////////////////////////////////////////////
        //  GPIO class
        function initIo(pin) {
            $http.get('/gpio/initIo/' + pin).then(function (res) {
                return res.status;
            }, function (res) {
                return res.status;
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

        function inPut(pin) {
            var def = $q.defer();

            $http.get('/gpio/' + pin).success(function (res) {
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