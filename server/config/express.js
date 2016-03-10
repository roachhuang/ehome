var express = require('express');
var morgan = require('morgan');

module.exports = function(app, config) {
    // logging request details
    app.use(morgan('dev'));
    //app.use(bodyParser.urlencoded({
    //  extended: false
    //})); // get info form htlm form
    //app.use(bodyParser.json());
    app.use(express.static(config.rootPath + 'public'));
    // view engine setup
    app.set('views', config.rootPath + '/server/views');
}