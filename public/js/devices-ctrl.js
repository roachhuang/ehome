(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('devicesCtrl', devicesCtrl);

    devicesCtrl.$inject = ['$scope', 'gpioService'];
    function devicesCtrl($scope, gpioService) {
        var vm = $scope;

        activate();

        ////////////////

        function activate() {
            vm.devices = [];
            // physical pin 11 = GPIO17
            // pi-gpio chose to use physical pin
            vm.devices.push(new Device('bedRoom', 11));
            vm.devices.push(new Device('livingRoom', 12));
            vm.devices.push(new Device('kitchen', 11));

            vm.devices.forEach(function (device) {
                device.status = gpioService.inPut(device.pin);
            });

            //////////////////
            function Device(name, GpioPin) {
                this.name = name;
                this.status = false;
                this.pin = GpioPin;
                this.cronJobs = [{ count: 0, on: '', off: '' }];

                // load cronjobs from local storage when initializing
                //this.readCronJobs();

                /* save items to local storage when unloading
                var self = this;
                // angular.element(window).on('unload', function () {
                angular.element(win).on('unload', function () {
                    //$(window).unload(function () {
                    if (self.clearCart) {
                        self.clearItems();
                    }
                    self.saveCron();
                    self.clearCart = false;
                });
                */


                Device.prototype.readCronJob = function () {
                    var items = localStorage != null ? localStorage[this.name] : null;
                    if (items != null && JSON != null) {
                        try {
                            items = JSON.parse(items);
                            for (var i = 0; i < items.length; i++) {
                                var item = items[i];
                                if (item.id != null && item.name != null && item.price != null) {
                                    this.cartData.push({
                                        count: 1,
                                        id: item.id,
                                        price: item.price,
                                        name: item.name
                                    });
                                }
                            }
                        } catch (err) {
                            // ignore errors while loading...
                        }
                    }
                };
                // save cronjobs to local storage (data will still exist if )
                Device.prototype.saveJobs2LocalStorage = function () {
                    //this.isCronGetUpdated = !this.isCronGetUpdated;
                    if (localStorage != null && JSON != null) {
                        // save all jobs at once
                        localStorage[this.name] = JSON.stringify(this.cronJobs);
                        //localStorage[this.name] = JSON.stringify(this.cronJobs);
                    }
                };

                Device.prototype.delSchedule = function (id) {
                    for (var i = 0; i < this.cron.length; i++) {
                        if (this.cron[i].id === id) {
                            this.cron.splice(i, 1);
                            break;
                        }
                    }
                    // save changes to local storage
                    this.saveCronData();
                };

                // reset cronjob
                Device.prototype.resetCron = function () {
                    this.cron = [];
                    this.saveCronData(); // save to local storage
                };

            }
            /////////////////////////////
        }

        vm.onOff = function (device) {
            // toogle btw 0 and 1
            device.status = device.status ^ 1;
            gpioService.outPut(device.status, device.pin);
        };
    }
})();