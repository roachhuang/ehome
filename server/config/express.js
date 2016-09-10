var express = require('express');
//var compress = require('compress');
var morgan = require('morgan');
// parse body into json obj and save it to res.body
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

module.exports = function (app, config) {
    //app.use(compress());
    // bodyParser looks at the body & see if it has any json obj in it. if so, take the json obj & add it to res.body.
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
    console.log('root: ', config.rootPath);
    // view engine setup
    //app.set('views', config.rootPath + '/public/views');
    //app.use(express.static(config.rootPath + 'public'));
    //config.env='build';
    switch (config.env) {
        case 'build':
            console.log('** BUILD **');
            app.use(express.static(config.rootPath + 'build/'));
            // Any invalid calls for templateUrls are under app/* and should return 404
            //app.use('/app/*', function (req, res, next) {
            //four0four.send404(req, res);
            //});
            // Any deep link calls should return index.html
            //app.use('/*', express.static(config.rootPath + 'build/index.html'));
            break;
        default:
            console.log('** DEV **');
            app.use(express.static(config.rootPath + 'public/'));
            //app.use(express.static('./'));
            //app.use(express.static('./.tmp'));
            // All the assets are served at this point.
            // Any invalid calls for templateUrls are under app/* and should return 404
            //app.use('/app/*', function (req, res, next) {
            //four0four.send404(req, res);
            //});
            // Any deep link calls should return index.html
            //app.use('/*', express.static(config.rootPath + 'public/index.html'));
            break;
    }


    //app.set('view engine', 'html');

    // development error handler
    /* will print stacktrace
    app.use(function (err, req, res, next) {
        // Do logging and user-friendly error message display
        console.error(err.stack);
        res.status(500).send('internal server error: ' + err);
    });
    */
};