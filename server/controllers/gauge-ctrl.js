
'use strict';
module.exports = function () {
    function Gauge(name) {
        this.name = name;
        this.data = [];
    }

    var dht = new Gauge();
    var battery1 = new Gauge();
    return {
        dht: dht,
        battery1: battery1
    }
}
