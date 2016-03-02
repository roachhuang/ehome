'use strict';
var YQL = require('yql');
var nodemailer = require('nodemailer');
var apod = require('nasa-apod');

var express = require('express');

module.exports = function() {
    var router = express.Router();

    router.get('/apod', function(req, res) {
        console.log('/apod');
        var client = new apod.Client({
            apiKey: '8q9BFt16841SFP8wBG2RtBfooeNg8ZiPodZQNLdA',
            conceptTags: true
        });

        // Get todays apod data 
        client().then(function(data) {
            res.status(200).json(data);
            //console.log(data);
        });
    });

    // sends failure Login state back to angular
    router.get('/yahoo', function(req, res) {
        console.log('yahoo');
        // return celsius
        var query = new YQL("select * from weather.forecast where (woeid = 2306179) and u='c'");
        query.exec(function(err, data) {
            var location = data.query.results.channel.location;
            //console.log(location);
            var condition = data.query.results.channel.item.condition;
            //console.log('The current weather in ' + yahoo.location.city + ', ' + yahoo.location.region + ' is ' + yahoo.condition.temp + ' degrees.');
            res.status(200).json(data);
        });
    });

    router.get('/email', function(req, res) {
        var smtpConfig = {
            service: 'gmail',
            auth: {
                user: 'giraftw2002@gmail.com',
                pass: '0916@tpe'
            }
        };

        // create reusable transporter object using the default SMTP transport 
        var transporter = nodemailer.createTransport(smtpConfig);

        // setup e-mail data with unicode symbols 
        var mailOptions = {
            from: 'smart home <giraftw2002@gmail.com>', // sender address 
            to: 'mark.huang@ca-sec.com', // list of receivers 
            subject: 'Intruder', // Subject line 
            text: 'Hello world', // plaintext body 
            html: '<b>Hello world</b>' // html body 
        };

        // send mail with defined transport object 
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
            res.status(200);
        });
    });
    return router;
}