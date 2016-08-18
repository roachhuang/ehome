var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');
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

gulp.task('inject', function () {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

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
        ignorePath: '../../public'  // we do not want ../../public injected into index.html
    };
    /* change to *.jade if you are using jade instead of html */
    return gulp.src('./public/views/index.html')
        .pipe(wiredep(options)) // wiredep looks up bower.json file
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./public/views'));
});

gulp.task('optimize', ['inject'], function(){
    //var assets = $.useref.assets({searchPath: './'});
    return gulp
        .src(config.index)  
        .pipe($.useref())        
        .pipe(gulp.dest(config.build));
})

gulp.task('serve-dev', ['inject'], function(){

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