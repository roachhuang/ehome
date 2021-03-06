#!/usr/bin/env node

'use strict';

// set NODE_ENV environment variable at cmd prompt. e.g., set NODE_ENV = production
// port defined in server/config/env/*.js file

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // has to be before config coz config reads it

const express = require('express');
var app = express();

var config = require('./config/config')[env];
//const io = require('socket.io').listen(app.listen(config.port));

// init xbee - setup baud rate, com port,  mode, etc.
var xbee = require('./config/xbee-obj')();

require('./config/express')(app, config);
require('./config/my-passport')(app, config);
// require(./server/config/mongoose')(config);

// render index.html
//app.get('/', function (req, res) {
//    res.sendFile(config.rootPath + '/public/index.html');
//});

var extapi = require('./routes/extapi');

// passing xbee to cron is for building frame for remote devices
var cron = require('./routes/cron.js')(xbee);
var gpio = require('./routes/gpio')(xbee);
var sensors = require('./routes/sensors')(xbee);

var users = require('./routes/users');
var auth = require('./routes/auth');

// router is mounted in a particular root url
app.use('/api', extapi);

app.use('/cron', cron);
app.use('/gpio', gpio);
app.use('/sensors', sensors);

app.use('/users', users);
app.use('/auth', auth);

/*
// catch 404 and forward to error handler
app.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development'){
    app.use(function(err, req, res, next){
        res.status(err.status||500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'development'){
    app.use(function(err, req, res, next){
        res.status(err.status||500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}
*/

app.listen(config.port, function() {
    console.log('Express server listening on port ' + config.port);
    console.log('env = ' + app.get('env') +
                '\n__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
});



