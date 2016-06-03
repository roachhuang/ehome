(function () {
    'use strict';

    angular
        .module('app.gpio', [])
        .factory('gpioService', gpioService);

    gpioService.$inject = ['$http'];
    function gpioService($http) {
        var service = {
            inPut: inPut,
            outPut: outPut,
            initIo: initIo
        };

        return service;

        //////////////////////////////////////////////////
        //  GPIO class
        function initIo(pin) {
            $http.get('/gpio/initIo' + pin).then(function(res) {
                return true;
            })
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
            $http.get('/gpio/' + pin).then(function (res) {
                return res.data.value;    // inside data there is an object value
            });
        }
    }
})();