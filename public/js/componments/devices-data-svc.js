(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('deviceService', deviceService);

    deviceService.$inject = ['$http', 'gpioService'];
    function deviceService($http, gpioService) {
        var devices = [], i;

        devices.push(new Device('bedRoom', 17));
        devices.push(new Device('livingRoom', 2));
        devices.push(new Device('kitchen', 3));
        for (i = 0; i < devices.length; i++) {
            //angular.extend(devices[i].gpio, gpioService);
            //devices[i].gpio = new Gpio(devices[i].pin);
            devices[i].gpio = gpioService;  // point to the same gpioService object
        }
        return devices;

        ////////////////
        //function exposedFn() { }
    }

    var Device = (function () {
        var nextId = 0; // init = 0

        return function Device(name, GpioPin) {
            this.id = nextId++;
            this.name = name;
            this.status = false;
            this.pin = GpioPin;
            this.gpio = {};
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
        };
    })();

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
    Device.prototype.saveCronData = function () {
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

    Device.prototype.getStatus = function () {
        //return this.gpio.inPut(this.pin);
        return false;
    };

    Device.prototype.setStatus = function (val) {
        this.gpio.outPut(val, this.pin);
        this.status = val;
    };
    // reset cronjob
    Device.prototype.resetCron = function () {
        this.cron = [];
        this.saveCronData(); // save to local storage
    };

})();

