(function() {
'use strict';

    angular
        .module('myApp')
        .factory('Cron', Cron);

    Cron.$inject = ['$resource'];
    function Cron($resource) {
        return $resource('/cron/:id', {id: '@id'}, {
            update: {
                method: 'PUT'
            }
        });
    }
})();