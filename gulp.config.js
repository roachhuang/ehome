module.exports = function () {
    var client = './public/'; // usually it should be the root of your app
    var clientApp = client + 'js/';
    var server = './server/';
    var cs = clientApp + 'css/';
    var root = './';
    var temp = '.tmp/';
    var config = {
        client: client,
        clientApp: clientApp,
        // all js to vet
        alljs: [
            clientApp + '**/*.js',  // ** means zero or more directories
            server + '**/*.js',
            './*.js'
        ], // no base is specified so by default it is set as './src/'

        build: './build/', // production folder, not dev folder
        // expose it as config.client
        html: client + '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        css: cs + '*.css',
        fonts: client + 'lib/font-awesome/fonts/**/*/*',
        images: client + 'assets/**/*.*',      
        index: client + 'index.html',
        js: [
            //client + '*.js'
            clientApp + '**/*.js', // in angular app we need 2 load any file that starts w/ module.js
            '!' + client + 'lib' // exclude lib files
        ],
        server: server,
        temp: temp,
        /**
         *  Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: client + 'lib',
            ignorePath: '../..'
        },

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.template',
                root: 'js/',
                standAlone: false
            }
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