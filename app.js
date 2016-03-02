'use strict';
// set NODE_ENV environment variable at cmd prompt. e.g., set NODE_ENV = production 
// port defined in server/config/env/*.js file

process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // has to be before config coz config reads it
var express = require('express');
var path = require('path'); 
var extapi = require('./routes/extapi')();

//var morgan = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');

var app = express();

//app.use(bodyParser.urlencoded({
//  extended: false
//})); // get info form htlm form
//app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// router is mounted in a particular root url
app.use('/api', extapi);

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, function(req, res) {
  console.info('Server running at http://localhost: 3000');
});