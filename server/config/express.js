var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

module.exports = function (app, config) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cookieParser());
    app.use(session({
        secret: 'roach',
        resave: true,
        saveUninitialized: true
    }));

    // logging request details
    app.use(morgan('dev'));
    //app.use(bodyParser.urlencoded({
    //  extended: false
    //})); // get info form htlm form
    //app.use(bodyParser.json());
    console.log(config.rootPath);
    // view engine setup
    //app.set('views', config.rootPath + '/public/views');
    app.use(express.static(config.rootPath + 'public'));

    //app.set('view engine', 'html');

    // development error handler
    // will print stacktrace
    app.use(function (err, req, res, next) {
        // Do logging and user-friendly error message display
        //console.error(err);
        res.status(500).send('internal server error: ' + err);
    });
};