var gulp = require('gulp'),
	postcss = require('gulp-postcss'),
	autopref = require('autoprefixer');

gulp.task("test", function(){
	return gulp.src('./src/css/*.css')
		.pipe(require('precss'))
		.pipe(gulp.dest('./dest'));
});