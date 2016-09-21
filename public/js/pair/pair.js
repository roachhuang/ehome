(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('pairController', pairController);

    pairController.$inject = ['gpio', '$timeout', 'toastr'];
    function pairController(gpio, $timeout, toastr) {
        var vm = this;
        vm.formData = {};

        activate();

        ////////////////

        function activate() {
            vm.formData.id = vm.formData.type = null;
            //vm.paired = false;
            vm.icon = "fa fa-plus-circle";
            //vm.error = false;
        }

        vm.ndCmd = function () {
            vm.icon = "fa fa-spinner fa-pulse fa-1x fa-fw";
            gpio.pair(vm.formData.id, vm.formData.type).then(function (res) {
                // ND cmd sent successfully
            });

            $timeout(function () {
                gpio.getXbee().then(function (res) {
                    if (res.data.xbee.newXbee.id === null) {
                        //vm.icon = "fa fa-check-circle";
                        toastr.success(vm.formData.id, '新增成功');
                        //vm.error = false;
                    } else {
                        //vm.icon = "fa fa-exclamation-circle";
                        toastr.error(vm.formData.id, '新增失敗! 請確定插入智能家電或打開 sensor 開關', {
                            closeButton: true
                        });
                        //vm.error = true;
                    }
                    vm.icon = "fa fa-plus-circle";
                });
            }, 4000);
        };
    }
})();