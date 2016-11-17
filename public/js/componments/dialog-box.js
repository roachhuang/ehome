(function () {
    'use strict';

    angular
        .module('app.modal', [])
        .factory('dialogBox', dialogBox);

    dialogBox.$inject = ['$uibModal'];
    function dialogBox($uibModal) {
        var service = {
            confirmRemove: confirmRemove
        };

        return service;

        ////////////////
        function confirmRemove(item) {
            var options = {
                animation: true,
                size: 'sm',
                templateUrl: '../../views/confirmRemove.html',
                controller: function () {
                    this.item = item;
                },
                // this is to enable caller to access item by modal.item
                controllerAs: 'vm.modal'
            };
            return $uibModal.open(options).result;
        }
    }
})();