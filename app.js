'use strict';

// set NODE_ENV environment variable at cmd prompt. e.g., set NODE_ENV = production
// port defined in server/config/env/*.js file

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // has to be before config coz config reads it

var express = require('express');
var app = express();
var config = require('./server/config/config')[env];

var xbee = require('./server/config/xbee');

require('./server/config/express')(app, config);
require('./server/config/my-passport')(app, config);
// require(./server/config/mongoose')(config);

// render index.html
app.get('/', function (req, res) {
    res.sendFile(config.rootPath + '/public/views/index.html');
});

var extapi = require('./server/routes/extapi');
var cron = require('./server/routes/cron.js');
var gpio = require('./server/routes/gpio');
var users = require('./server/routes/users');
var auth = require('./server/routes/auth');

// router is mounted in a particular root url
app.use('/api', extapi);
app.use('/cron', cron);
app.use('/gpio', gpio);
app.use('/users', users);
app.use('/auth', auth);

app.listen(config.port, function (req, res) {
    console.info('Listening on port: ' + config.port + '...');
});