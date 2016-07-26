(function () {
    'use strict';

    angular
        .module('app.gpio', [])
        .factory('gpioService', gpioService);
    gpioService.$inject = ['$http'];
    function gpioService($http) {
        var service = {
            //value: '',
            inPut: inPut,
            outPut: outPut
        };

        return service;

        //////////////////////////////////////////////////
        //  GPIO class

        // remote or local pin control
        function outPut(value, pin, addr) {
            var val = value;
            var req = {
                method: 'POST',
                url: '/gpio/' + pin + '/' + addr,
                //transformRequest: transformRequestAsFormPost,
                data: { val: val }
            };
            return $http(req).then(function (res) {
                //console.log(res.data);
                return res.data;
            });
        }
        /*
                function inPut(pin, addr) {
                    var def = $q.defer();
                    $http.get('/gpio/' + pin + '/' + addr).success(function (data) {
                        service.value = data.value;
                        def.resolve(data.value);
                    }).error(function () {
                        def.reject('failed to get IO status');
                    });
                    return def.promise;
                }
            }
        */
        function inPut(pin, addr) {
            return $http.get('/gpio/' + pin + '/' + addr).then(function (res) {
                return res.data.value;
            });
        }
    }
})();