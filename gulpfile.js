var gulp = require('gulp'),
	postcss = require('gulp-postcss'),
	precss = require('precss'),
	autopref = require('autoprefixer');

gulp.task("default", function(){


	return gulp.src('./src/css/*.css').pipe(postcss( [precss] )).pipe(gulp.dest('./dest'));
});