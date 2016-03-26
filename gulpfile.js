var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var strip = require('gulp-strip-comments');

gulp.task('ugly', function() {
	return gulp.src(['small_promise.js'])
		.pipe(rename('ugly_small_promise.js'))
		// Remove comments
		.pipe(strip())
		// small_promise -> P
		.pipe(replace(/small_promise/mg, 'P'))
		.pipe(replace(/var P/mg, 'var small_promise'))
		// protoClass -> K
		.pipe(replace(/protoClass/mg, 'K'))
		// callback_builder -> B
		.pipe(replace(/callback_builder/mg, 'B'))
		// (callback_builder specific) promiseObj -> o 
		.pipe(replace(/promiseObj/mg, 'o'))
		// (callback_builder specific) callbackArray -> a
		.pipe(replace(/callbackArray/mg, 'a'))
		// (callback_builder specific) newStatus -> n
		.pipe(replace(/newStatus/mg, 'n'))
		// executor -> e
		.pipe(replace(/executor/mg, 'e'))
		// value -> v
		.pipe(replace(/value/mg, 'v'))
		.pipe(replace(/val/mg, 'v'))
		// .status -> .s
		.pipe(replace(/.status/mg, '.s'))
		// .then_array -> .t
		// .catch_array -> .c
		.pipe(replace(/.then_array/mg, '.t'))
		.pipe(replace(/.catch_array/mg, '.c'))
		// onFulfilled -> f
		// onRejected -> r
		.pipe(replace(/onFulfilled/mg, 'F'))
		.pipe(replace(/onRejected/mg, 'R'))
		// forEachErrMsg -> m
		.pipe(replace(/forEachErrMsg/mg, 'M'))
		// iterable -> I
		.pipe(replace(/iterable/mg, 'I'))
		// is_function -> Q
		.pipe(replace(/is_function/mg, 'Q'))
		// Remove blank lines
		.pipe(replace(/^\s*\n/mg, ''))
		// Build ugly script
		.pipe(gulp.dest('bin'));
});

gulp.task('minify', ['ugly'], function() {
	return gulp.src(['bin/ugly_small_promise.js'])
		.pipe(rename('small_promise.min.js'))
		.pipe(uglify({
			mangle: false,
			preserveComments: "license"
		}).on('error', gutil.log))
		.pipe(gulp.dest('bin'));
});

gulp.task('polyfill', ['minify'], function() {
	return gulp.src(['bin/small_promise.min.js'])
		.pipe(rename('small_promise.polyfill.min.js'))
		.pipe(replace(/var small_promise=/mg, 'window.Promise=window.Promise||'))
		.pipe(uglify({
			mangle: false
		}).on('error', gutil.log))
		.pipe(gulp.dest('bin'));
});

gulp.task('polyfill_ie8', ['minify'], function() {
	return gulp.src([
			'depends_ie8.js',
			'bin/small_promise.polyfill.min.js'
		])
		.pipe(concat('small_promise.polyfill-ie8.min.js'))
		//.pipe(uglify({
		//	mangle: false
		//}).on('error', gutil.log))
		.pipe(gulp.dest('bin'));
});

gulp.task('default', ['polyfill_ie8']);
