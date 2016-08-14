(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('deviceService', deviceService);

    deviceService.$inject = [];
    function deviceService() {
        //todo: pair xbee devices to get their address64 before using it.
        var xbee01Addr = '0013A20040EB556C';
        var devices = [];
        // physical pin 11 = GPIO17
        // physical pin 12 = GPIO18
        // onoff is using GPIO number instead of pin# .
        // or DIO5?
        devices.push(new Device('remote PWR outlet', 'D0', xbee01Addr.toLowerCase()));
        //devices.push(new Device('bedRoom', 7));
        //devices.push(new Device('livingRoom', 23));
        devices.push(new Device('kitchen', 24, 'gpio08'));
        return devices;

        ////////////////
        //function exposedFn() { }
    }

    //var Device = (function () {
    //    var nextId = 0; // init = 0

    //    return function Device(name, GpioPin, addr) {
    //this.id = nextId++;
    function Device(name, GpioPin, addr) {
        this.name = name;
        this.status = 0;    //toto: 0 or null (init state?)
        this.pin = GpioPin;
        this.addr = addr || null;
    }

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

})();

