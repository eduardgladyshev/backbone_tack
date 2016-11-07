var gulp = require('gulp'),
	postcss = require('gulp-postcss'),
	scss = require('postcss-scss'),
	precss = require('precss');

gulp.task("default", function(){
	return gulp.src('./src/styles/*.css')
		.pipe( postcss( [precss({syntax: scss}) ] ))
		.pipe(gulp.dest('./dest/'));
});

gulp.watch('./src/styles/**', () => {
	gulp.run();
	console.log("run gulp.watch"); 
});