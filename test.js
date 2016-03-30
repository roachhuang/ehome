
'use strict';
// set NODE_ENV environment variable at cmd prompt. e.g., set NODE_ENV = production 
// port defined in server/config/env/*.js file

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // has to be before config coz config reads it

var express = require('express');
var app = express();
var config = require('./server/config/config')[env];

require('./server/config/express')(app, config);
// require(./server/config/mongoose')(config);

app.use('/api', extapi);

app.listen(config.port, function(req, res) {
    console.info('Listening on port: ' +config.port + '...');
});
config = require("./server/config/oauth2-config.js")
var GoogleOAuth2 = require('google-oauth2')(config);
var scope = 'https://www.googleapis.com/auth/drive'

GoogleOAuth2.getAuthCode(scope, function(err, auth_code) {
	if(err) console.error(err);
	console.log(auth_code);   
})