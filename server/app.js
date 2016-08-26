'use strict';

// set NODE_ENV environment variable at cmd prompt. e.g., set NODE_ENV = production
// port defined in server/config/env/*.js file

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // has to be before config coz config reads it

var express = require('express');
var app = express();

var config = require('./config/config')[env];
//const io = require('socket.io').listen(app.listen(config.port));

// create sensor objects - window and door
//var sensorObj = require('./server/config/sensor-obj')(io);
var sensorObj = require('./config/sensor-obj')();

// init xbee - setup baud rate, com port,  mode, etc.
var xbee = require('./config/xbee-obj')(sensorObj);

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
var users = require('./routes/users');
var auth = require('./routes/auth');
var sensors = require('./routes/sensors')(sensorObj);

// router is mounted in a particular root url
app.use('/api', extapi);
app.use('/cron', cron);
app.use('/gpio', gpio);
app.use('/users', users);
app.use('/auth', auth);
app.use('/sensors', sensors);
app.listen(config.port, function() {
    console.log('Express server listening on port ' + config.port);
    console.log('env = ' + app.get('env') +
                '\n__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
});

//app.listen(config.port, function (req, res) {
//    console.info('Listening on port: ' + config.port + '...');
//});



