(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$scope'];
    function SettingsController($scope) {
        var vm = $scope;

        activate();

        ////////////////

        function activate() {            
            vm.myConfig = {
                options: {
                    allowMinute: false,
                    //allowWeek: false,
                    allowMonth: false,
                    allowYear: false
                }
            }
        }
    }
   

})();