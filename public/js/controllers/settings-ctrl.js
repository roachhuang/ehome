(function() {
'use strict';

    angular
        .module('myApp')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [];
    function SettingsController() {
        var vm = this;


        activate();

        ////////////////

        function activate() { }
    }
})();