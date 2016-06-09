'use strict';

var TMClient = require('textmagic-rest-client');

module.exports = function () {
    var c = new TMClient('markhuang', 'g4sxO6FrzpOordGvKJNVcgjX45f0sy');
    c.Messages.send({ text: '客廳窗戶被開啓!', phones: '886922719061' }, function (err, res) {
        console.log('Messages.send()', err, res);
    });
};
