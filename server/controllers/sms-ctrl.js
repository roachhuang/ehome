'use strict';
/*
var TMClient = require('textmagic-rest-client');

module.exports = function () {
    var c = new TMClient('markhuang', 'g4sxO6FrzpOordGvKJNVcgjX45f0sy');
    c.Messages.send({ text: '客廳窗戶被開啓!', phones: '886922719061' }, function (err, res) {
        console.log('Messages.send()', err, res);
    });

    var config = {
        "disable": true,
        "userkey": "EPT34QUZU30U",
        "password": "0916@tpe",
        "originator": "mark.huang@ca-sec.com",
        // Optional: 
        //"deliveryNotificationUrl": "http://example.com/success",
        //"nonDeliveryNotificationUrl": "http://example.com/failure"
    };

    var sms = require('mod-aspsms')(config);

    var msg = 'Test SMS from aspsms';

    var addressBook = ['+886922719061'];

    for (var i = 0; i < addressBook.length; i++) {
        sms.send(addressBook[i], msg);
    }
}

var tropoWebApi = require('tropo-webapi');
module.exports = function () {
    var tropo = new tropoWebApi();
    //to, answerOnMedia, channel, from, headers, name, network, recording, required, timeout
    tropo.call("+886922719061", null, null, null, null, null, "SMS", null, null, null);
    tropo.say("Tag, you're it!!");
    response.end(TropoJSON(tropo));
}
*/

//require the Twilio module and create a REST client
var client = require('twilio')('AC6d039bbd7d5c8d5dd4a825d01d69b38f', '9939dde14c00c84eea02017366d8afec');
module.exports = function () {
    //Send an SMS text message
    client.sendMessage({

        to: '+886922719061', // Any number Twilio can deliver to
        //from: '+14506667788', // A number you bought from Twilio and can use for outbound communication
        from: '+3158280631',
        body: 'window#1 in the living room gets opened!' // body of the SMS message

    }, function (err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) { // "err" is an error received during the request, if any

            // "responseData" is a JavaScript object containing data received from Twilio.
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1

            console.log(responseData.from); // outputs "+14506667788"
            console.log(responseData.body); // outputs "word to your mother."

        }
    });

    //Place a phone call, and respond with TwiML instructions from the given URL
    client.makeCall({

        to: '+886922719061', // Any number Twilio can call
        from: '+3158280631', // A number you bought from Twilio and can use for outbound communication
        url: 'http://www.example.com/twiml.php' // A URL that produces an XML document (TwiML) which contains instructions for the call

    }, function (err, responseData) {

        //executed when the call has been initiated.
        console.log(responseData.from); // outputs "+14506667788"

    });

    return client;
}
