(function () {
    'use strict';

    angular
        .module('app.gpio', [])
        .factory('gpio', gpioService);
    gpioService.$inject = ['$http'];
    function gpioService($http) {
        var service = {
            //value: '',
            inPut: inPut,
            outPut: outPut,
            pair: pair,
            rmtAtCmd: rmtAtCmd,
            atCmd: atCmd,
            getXbee: getXbee,
            updateDeviceName: updateDeviceName,
            delDevice: delDevice
        };

        return service;

        //////////////////////////////////////////////////
        //  GPIO class

        // remote or local pin control
        function outPut(value, pin, addr) {
            var val = value;
            var req = {
                method: 'POST',
                url: '/gpio/io/' + pin + '/' + addr,
                //transformRequest: transformRequestAsFormPost,
                data: { val: val }
            };
            return $http(req);
            //console.log(res.data);
            //return res.data;
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
            return $http.get('/gpio/io/' + pin + '/' + addr);
            //    return res.data.value;
        }

        function pair(id, type) {
            return $http.get('/gpio/pair/' + id + '/' + type);
            //    return res.data.value;
        }

        function rmtAtCmd(addr, cmd, cmdParam) {
            return $http.get('/gpio/rmtAtCmd/' + addr + '/' + cmd + '/' + cmdParam);
        }

        function atCmd(cmd, cmdParam) {
            return $http.get('/gpio/atCmd/' + cmd + '/' + cmdParam);
        }

        function getXbee() {
            return $http.get('/gpio');
            //    return res.data.value;
        }

        function updateDeviceName(newName, index) {
            var req = {
                method: 'PUT',
                url: '/gpio/' + index,
                contentType: 'applicaton/json',
                //transformRequest: transformRequestAsFormPost,
                data: { name: newName }
            };
            return $http(req);
        }

        function delDevice(index) {
            var req = {
                method: 'DELETE',
                url: '/gpio/' + index,
                //transformRequest: transformRequestAsFormPost,
                //data: {}
            };
            return $http(req);
        }
        //function atCmd(cmd, cmdParam) {
        //    return $http.get('/gpio/atCmd/' + '/' + cmd + '/' + cmdParam);
        //}
    }
})();