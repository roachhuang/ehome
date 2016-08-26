var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');
var del = require('del');
var args = require('yargs').argv;

var config = require('./gulp.config')();
//var del = require('del');

/*  get all plugins for me (no require(<plugin>) is required, but still need npm install it.
 *  npm install gulp-<pulgin> --save-dev
 */
var $ = require('gulp-load-plugins')({
    lazy: true
});
var port = process.env.PORT || config.defaultPort;
//var env = $.util.env;

function errorLog(error) {
    console.error.bind(error);
    this.emit('end');
}

var jsFiles = ['*.js', './public/js/**/*.js', './server/**/*.js'];
var cssFiles = ['*.css', './public/css/*.css'];

gulp.task('style', function () {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs());
});

/*  Automation add js and css
 *   it looks through the Bower files and finds all the dependencies and inject them into html
 */
/*
gulp.task('inject1', function () {
    //log('Wiring up the bower dependencies (css and js), and our app js into the html');

    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions(); // where is the bower file

    return gulp
        .src(config.index) // get index.html file
        .pipe(wiredep(options)) // wiredep looks up bower.json
        // find all the files matching that pattern, config.js, and inject all those things into index.html
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.clientApp));
});
*/

gulp.task('inject', ['templatecache'], function () {
    var wiredep = require('wiredep').stream;
    //var inject = require('gulp-inject');

    var injectSrc = gulp.src(['./public/css/*.css',
        './public/js/**/*.js'], {
            read: false // we just need the filename, so don't read the files.
        }, {
            relative: true
        });

    var injectOptions = {
        // coz we have set 'public' as root path of the site by app.use(express.static(config.rootPath + 'public'));
        ignorePath: '/public'
    };

    var options = {
        bowerJson: require('./bower.json'),
        directory: './public/lib',  // the dir is specified in bowerrc file
        ignorePath: '../../public'  // we do not want ../../public get injected into index.html
    };
    /* change to *.jade if you are using jade instead of html */
    return gulp.src(config.index)
        .pipe(wiredep(options)) // wiredep looks up bower.json file
        .pipe($.inject(injectSrc, injectOptions))
        .pipe(gulp.dest(config.clientApp));
});

/////////////////////////////////////////////////////////////////////////////
/**
 * Before deploying, it’s a good idea to clean out the destination folders
 and rebuild the files—just in case any have been removed from the source
 and are left hanging out in the destination folder:
 */
gulp.task('clean', function (done) {
    var delconfig = [].concat(config.build, config.temp);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-fonts', function (done) {
    clean(config.build + 'fonts', done);
});

/**
 * Remove all images from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-images', function (done) {
    clean(config.build + 'images/**/*.*', done);
});
///////////////////////////////////////////////////////////////////////////

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['clean-images'], function () {
    log('Compressing and copying images');

    return gulp
        .src(config.images)
        .pipe($.imagemin({ optimizationLevel: 4 }))
        .pipe(gulp.dest(config.build + 'images'));
});

// Gulp task for creating template cache
gulp.task('templatecache', function () {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({ empty: true }))
        //.pipe($.angularTemplatecache())
        
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        
        .pipe(gulp.dest(config.temp));
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}

gulp.task('templatecache', ['clean-code'], function () {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.if(args.verbose, $.bytediff.start()))
        .pipe($.minifyHtml({ empty: true }))
        .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});
*/


//gulp.task('optimize', ['clean','html', 'fonts','inject'], function () {
gulp.task('optimize', ['inject'], function () {
    var templateCache = config.temp + config.templateCache.file;

    log('Optimizing the js, css, html');
    var assets = $.useref({ searchPath: './' });
    return gulp
        .src(config.index)
        .pipe($.plumber())
        //.pipe($.inject(templateCache, 'templates'))    

        .pipe($.inject(gulp.src(templateCache, { read: false }), {
            starttag: '<!-- inject:templates:js -->'
        }))
        .pipe($.useref()) 

        //.pipe(assets.restore())
        //.pipe($.useref())

        // Minifies only if it's a JavaScript file  
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(gulp.dest(config.build));
});

/**
 * Copy fonts
 * @return {Stream}
 */
//gulp.task('fonts', ['clean-fonts'], function () {
gulp.task('fonts', function () {
    log('Copying fonts');
    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});
// Task to minify new or changed HTML pages
gulp.task('html', ['fonts'], function () {
    return gulp.src(config.html)
        .pipe($.minifyHtml())
        //.pipe(gulp.dest('./build/'));
        .pipe(gulp.dest(config.build));
});

gulp.task('serve-build', ['optimize'], function () {

})

gulp.task('jshint', function () {
    log('Creating an AngularJS $templateCache');
    return gulp
        .src(pkg.paths.htmltempaltes)
        .pipe(plug.angularTemplatecache('templates.js', {
            module: 'app.core',
            standalone: false,
            root: 'app/'
        }))
        .pipe(gulp.dest(pkg.paths.stage));
});


/** 
 * @desc Minify and bundle the app's js
 */
gulp.task('js', ['jshint'], function () {
    var source = [].concat(pkg.paths.js);
    return gulp
        .src(source)
        .pipe(plug.sourcemaps.init())
        .pipe(plug.concat('all.min.js'))
        //.pipe(plug.ngAnnotate({add: true, single_quotes: true}))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify({ mangle: true }))
        .pipe(plug.bytediff.stop(common.bytediffformatter))
        .pipe(plug.sourcemaps.write('./'))
        .pipe(gulp.dest(pkg.paths.stage));
});

gulp.task('scripts', function () {
    return gulp.src(config.js)
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe($.concat('main.js'))	// concatenates all the files into a single file named main.js
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('serve-dev', ['inject'], function () {

})

// run style and inject and then the func
gulp.task('serve', ['style', 'inject'], function () {
    var options = {
        script: 'app.js',
        ext: 'js',
        dealyTime: 1,
        env: {
            'PORT': 3000
        },
        ignore: ['./node_modules/**'],
        watch: jsFiles
    };
    return nodemon(options)
        .on('restart', function () {
            console.log('restarting...');
        });
});

//////////////////////////
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);    // done is a call back func in del package
}

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner) {
    var debug = args.debug || args.debugBrk;
    var debugMode = args.debug ? '--debug' : args.debugBrk ? '--debug-brk' : '';
    var nodeOptions = getNodeOptions(isDev);

    if (debug) {
        runNodeInspector();
        nodeOptions.nodeArgs = [debugMode + '=5858'];
    }

    if (args.verbose) {
        console.log(nodeOptions);
    }

    return $.nodemon(nodeOptions)
        .on('restart', ['vet'], function (ev) {
            log('*** nodemon restarted');
            log('files changed:\n' + ev);
            setTimeout(function () {
                browserSync.notify('reloading now ...');
                browserSync.reload({ stream: false });
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync(isDev, specRunner);
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

function errorLog(error) {
    console.error.bind(error);
    this.emit('end');
}