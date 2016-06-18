var gulp = require('gulp'),
	args = require('yargs').argv;

var config = require('./gulp.config')();
var del = require('del');

/*  get all plugins for me (no require(<plugin>) is required, but still need npm install it.
 *  npm install gulp-<pulgin> --save-dev
 */
var $ = require('gulp-load-plugins')({lazy: true});
var port = process.env.PORT || config.defaultPort;

var env = $.util.env;

function errorLog(error){
	console.error.bind(error);
	this.emit('end');
}

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('fonts', ['clean-fonts'], function() {
	log('copying fonts');
	return gulp.src(config.fonts)
		.pipe(gulp.dest(config.build + 'fonts'));
});

/**
 * Before deploying, it’s a good idea to clean out the destination folders
 and rebuild the files—just in case any have been removed from the source
 and are left hanging out in the destination folder:
 */
gulp.task('clean', function(done) {
	var delconfig = [].concat(config.build, config.temp);
	log('Cleaning: ' + $.util.colors.blue(delconfig));
	del(delconfig, done);
});

gulp.task('clean-code', function(done) {
	// all of the code-like files inside of our build and temp folders.
	var files = [].concat(
		config.temp + '**/*.js',
		config.build + '**/*.html',
		config.build + 'js/**/*.js'
	)
	clean(files, done);
});

gulp.task('clean-fonts', function(done) {
	clean(config.build + 'fonts/**/*.*', done);
});

gulp.task('clean-images', function(done) {
	clean(config.build + 'images/**/*.*', done);
});

gulp.task('clean-css', function(done) {
	clean(config.temp + '**/*.css', done);
});

/* image task
 compress img and utilise caching to save re-compressing
 already compressed images each time this task run
 */
gulp.task('images', ["clean-images"], function() {
	log('copying and compressing the images');
	return gulp
		.src(config.images)
		.pipe($.imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
		.pipe(gulp.dest(config.build + 'images'));
		//.pipe($.livereload);
});

gulp.task('vet', function() {
	log('Analyzing sources with JSHint and JSCS');
	return gulp
		.src(config.alljs)
		.pipe($.jscs())
		// .on('error', errorLog)
		.pipe($.jshint())
		// .on('error', errorLog)
		.pipe($.uglify())
		.on('error', errorLog)
		.pipe(gulp.dest('./build/'));
});

// replace wiredep with inject after you have task styles ready
gulp.task('serve-dev', ['wiredep'], function() {
	var nodeOptions = {
		script: config.nodeServer,  // app.js in server folder
		delaytime: 1,
		env: {
			'PORT': port,
			"NODE_ENV": isDev ?  'dev' : 'build'
		},
		watch: [config.server]
	};
	return $nodemon(nodeOptions)
		// you can also inject task when restart like below
		//.on('restart', ['vet'], function(ev) {
		.on('restart', function(ev) {
			log('*** nodemon restarted');
			log('files changed on restarted:\n' + ev);
		})
		.on('start', function() {
			log ('*** nodemon started');
		})
		.on('crash', function() {
			log("*** nodemon crashed: script crashed for some reason");
		})
		.on('exit', function() {
			log('*** nodemon exited cleanly');
		});
});

/*  Automation add js and css
 *   it looks through the Bower files and finds all the dependencies and inject them into html
 */
gulp.task('wiredep', function() {
	log('Wiring up the bower dependencies (css and js), and our app js into the html');

	var wiredep = require('wiredep').stream;
	var options = config.getWiredepDefaultOptions();    // where is the bower file

	return gulp
		.src(config.index)// get index.html file
		.pipe(wiredep(options))// wiredep looks up bower.json
		// find all the files matching that pattern, config.js, and inject all those things into index.html
		.pipe($.inject(gulp.src(config.js)))
		.pipe(gulp.dest(config.client));
});



gulp.task('ngAnnotateTest', function(){
	log("Annotating AngularJS dependencies");
	var source =[].concat(pkg.paths.js);
	return gulp
		// .src(source)
		.src('./client/app/avengers/avengers.js')
		.pipe(plug.ngAnnotate({add: true, single_quotes: true}))
		.pipe(plug.rename(function(path){
			path.extname = '.annotated.js';
		}))
		.pipe(gulp.dest('./client/app/avengers'));
});

/**
 * @desc Minify and bundle the app's js
 */
 gulp.task('js', ['jshint','templatecache'], function(){
 	var source = [].concat(pkg.paths.js, pkg.paths.stage +'templatecache');
 	return gulp
 		.src(source)
 		.pipe(plug.sourcemaps.init())
 		.pipe(plug.concat('all.min.js'))
 		.pipe(plug.ngAnnotate({add: true, single_quotes: true}))
 		.pipe(plug.bytediff.start())
 		.pipe(plug.uglify({mangle:true}))
 		.pipe(plug.bytediff.stop(common.bytediffformatter))
 		.pipe(plug.sourcemaps.write('./'))
 		.pipe(gulp.dest(pkg.paths.stage));
 });

gulp.task('scripts', function() {
  return gulp.src(config.js)
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('default'))
    .pipe($.concat('main.js'))	// concatenates all the files into a single file named main.js
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe($.uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('jshint', function(){
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

gulp.task('styles', function(){
	gulp.src('scss/**/*.scss')
		//.pipe(plumber())
		.pipe(sass({style: 'compressed'}))
		.on('error', errorLog)
		.pipe(autoprefixer('last 2 versions', '> 5%'))	// i may not need this
		.pipe(gulp.dest('css/'))
		.pipe(livereload);
});

gulp.task('minicss', function(){
	log('compressing, bundling, complying vendor CSS');
	return gulp
		.src(pkg.paths.vendrorcss)
		.pipe(plug.concat('vednor.min.css'))
		.pipe(plug.bytediff.start())
		.pipe(plug.minifycss({}))
		.pipe(plug.bytediff.stop(common.bytediffformatter))
		.pipe(gulp.dest(pkg.paths.stage + 'content'));
});

/* watch Task
	when js changes it runs task1. e.g., you can minifiy your js automatically evertime it changes
*/
gulp.task('watch', function(){
	var server = livereload();

	gulp.watch('**/my.js', ['script']);
	gulp.watch('css/**/*.css', ['css']);
	gulp.watch('images/*', ['image']);
});

/**
* Notice the additional array in gulp.task. This is where we can define task dependencies.
* In this example, the clean task will run before the tasks in gulp.start.
* Tasks in Gulp run concurrently together and have no order in which they’ll finish,
* so we need to make sure the clean task is completed before running additional tasks.

gulp.task('default', ['clean'], function(){
	gulp.start('scripts', 'css', 'images', 'watch');
});

*/

//////////////////////////
function clean(path, done) {
	log('Cleaning: ' + $.util.colors.blue(path));
	del(path, done);    // done is a call back func in del package
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