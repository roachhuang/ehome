var Device = (function () {
    var nextId = 1;

    return function Device(name, GpioPin) {
        this.id = nextId++;
        this.name = name;
        this.pin = GpioPin;
        this.location;
        this.status;
        this.cronOnJobs = [6];   // each dev can have max. of 6 cronjob
        this.cronOffJobs = [6];   // each dev can have max. of 6 cronjob
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
    var items = localStorage != null ? localStorage[this.cartName + '_items'] : null;
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
    this.isCronGetUpdated = !this.isCronGetUpdated;
    if (localStorage != null && JSON != null) {
        localStorage[this.cartName + "_items"] = JSON.stringify(this.cron);
    }
};

// add a cronjob to a device
Device.prototype.addSchedule = function (jobId, cron) {
    // max 6 cronjob for a device

    this.cron[jobId].push(cron);
    // save changes to local storage
    //this.saveCronData();
};

Device.prototype.delSchedule = function (id) {
    for (var i = 0; i < this.cron.length; i++) {
        if (this.cron[i].id === id) {
            this.cron.splice(i, 1);
            break;
        }
    }
    // save changes to local storage
    this.saveCron();
};
Device.prototype.getScheudle = function () {
    return this.cron;
};
Device.prototype.getStatus = function () {
    //this.status = readPin();
};
Device.prototype.setStatus = function () {

};
// reset cronjob
Device.prototype.resetCron = function () {
    this.cron = [];
    this.saveCronData(); // save to local storage
};