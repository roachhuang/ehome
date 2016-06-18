module.exports = function () {
    var client = './'; // usually it should be the root of your app
    var clientApp = client + 'public/';
    var server = './server/';
    var temp = clientApp + 'css/';
    var config = {
        client: client,
        clientApp: clientApp,
        // all js to vet
        alljs: [
            clientApp + 'js/**/*.js' // ** means zero or more directories
        ], // no base is specified so by default it is set as './src/'

        build: './prod/', // production folder, not dev folder
        // expose it as config.client

        css: temp + '*.css',
        fonts: clientApp + 'lib/font-awesome/fonts/**/*/*',
        images: clientApp + 'assets/**/*.*',
        index: clientApp + 'views/index.html',
        js: [
            //client + '*.js'
            clientApp + 'js/**/*.js', // in angular app we need 2 load any file that starts w/ module.js
            '!' + clientApp + 'lib' // exclude lib files
        ],
        server: server,
        temp: temp,
        /**
         *  Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: clientApp + 'lib',
            ignorePath: '../..'
        },
        /**
         *      Node settings
         */
        defaultPort: 7203,
        nodeServer: './server/app.js'

    };

    // return an options object for wiredep
    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerjson: config.bower.json, // see line 30
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};