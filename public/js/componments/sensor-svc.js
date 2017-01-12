
(function () {
    'use strict';

    angular
        .module('app.sensor', [])
        .factory('sensorSvc', sensorService);
    sensorService.$inject = ['$http'];
    function sensorService($http) {

        var setSensorAvailability = function (sensors) {
            var req = {
                method: 'POST',
                url: '/sensors/setSensorAvailability',
                //transformRequest: transformRequestAsFormPost,
                data: { sensors: sensors }
            };
            return $http(req);
        };

        var getSensors = function () {
            return $http.get('/sensors');
        };

        function updateSensorName(newName, index) {
            var req = {
                method: 'PUT',
                url: '/sensors/' + index,
                contentType: 'applicaton/json',
                //transformRequest: transformRequestAsFormPost,
                data: { name: newName }
            };
            return $http(req);
        }

        function delSensor(index) {
            var req = {
                method: 'DELETE',
                url: '/sensors/' + index,
                //transformRequest: transformRequestAsFormPost,
                data: {}
            };
            return $http(req);
        }

        return {
            updateSensorName: updateSensorName,
            delSensor: delSensor,
            setSensorAvailability: setSensorAvailability,
            getSensors: getSensors
        };
    }
})();