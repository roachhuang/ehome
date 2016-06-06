'use strict';
var config = {
    "disable": true,
    "userkey": "EPT34QUZU30U",
    "password": "0916@tpe",
    "originator": "222607",
    // Optional: 
    //"deliveryNotificationUrl": "http://example.com/success",
    //"nonDeliveryNotificationUrl": "http://example.com/failure"
};

var sms = require('mod-aspsms')(config);

module.exports = function () {
    /*
    var msg = 'Test SMS from NodeJs';
    var addressBook = ['+886922719061'];
    for (var i = 0; i < addressBook.length; i++) {
        sms.send(addressBook[i], msg);
    }
*/
}
