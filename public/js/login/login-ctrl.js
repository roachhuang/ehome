(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$location'];
    function loginCtrl($scope, $location) {
        var vm = $scope;
        vm.login = function () {
            if (vm.user.id === 'pi' && vm.user.password === 'pi') {
                vm.hasLoggedIn = true;
                $location.path('/');
            }            
        }

        activate();

        ////////////////

        function activate() {
            vm.user = {
                id: '',
                password: ''
            };
        }
    }
})();