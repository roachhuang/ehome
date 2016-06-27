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
            var def = $q.defer();
<<<<<<< HEAD
            console.log('entered getGpioObj!!!!');
            $http.get('/gpio/onoffobj/' + pin).success(function (data) {
=======

            $http.get('/gpio/' + pin).success(function (data) {
>>>>>>> 0ec0a1cc276d68b06f8d88c593512420174f7f19
                service.value = data;
                def.resolve(data);
            }).error(function () {
                def.reject('failed to get GPIO Obj');
            });
            return def.promise;
<<<<<<< HEAD
        }
=======
        } 
>>>>>>> 0ec0a1cc276d68b06f8d88c593512420174f7f19

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

<<<<<<< HEAD
        function inPut(pin) {
            var def = $q.defer();

            $http.get('/gpio/' + pin).success(function (data) {
=======
        function inPut(pin, gpioObj) {
            var def = $q.defer();

            $http.get('/gpio/' + pin + '/' + gpioObj).success(function (data) {
>>>>>>> 0ec0a1cc276d68b06f8d88c593512420174f7f19
                service.value = data.value;
                def.resolve(data.value);
            }).error(function () {
                def.reject('failed to get IO status');
            });
            return def.promise;
<<<<<<< HEAD
        }
=======
        }      
>>>>>>> 0ec0a1cc276d68b06f8d88c593512420174f7f19
    }
})();