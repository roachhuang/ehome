(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('pairController', pairController);

    pairController.$inject = ['gpio'];
    function pairController(gpio) {
        var vm = this;
        vm.formData = {};

        activate();

        ////////////////

        function activate() {
            vm.formData.id = vm.formData.type = null;
        }
        vm.ndCmd = function () {
            gpio.pair(vm.formData.id, vm.formData.type);
        };
    }
})();