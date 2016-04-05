var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'public/**/*.js'];

gulp.task('style', function () {
	return gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-sylish', {
			verbose: true;
		}))
		.pipe(jscs());
});

gulp.task('inject', function () {
	var wiredep = require('wiredep').stream;
	var inject = require('gulp-inject');

	var injectSrc = julp.src(['./public/css/*.css', './public/js/**/*.js'], {
		read: false
	});
	var injectOptions = {
		ignorePath: '/public'
	}

	var options = {
			bowerJson: require('./bower.json');
			directory: './public/lib'
			, ignorePath: '../../public'
		}
		/* change to *.jade if you are using jade instead of html */
	return gulp.src('./public/views/*.html')
		.pipe(wiredep(options))
		.pipe(inject(injectSrc, injectOptions))
		.pipe(gulp.dest('./public/views'));
});

// run style and inject and then the func
gulp.task('serve', ['style', 'inject'], function () {
			var options = {
				script: 'app.js'
				, dealyTime: 1
				, env: {
					"PORT": 3000
				}
				, watch: jsFiles
			}
			return nodemon(options)
				.on('restart', function () {
					console.log('restarting...');
				})
			
			
