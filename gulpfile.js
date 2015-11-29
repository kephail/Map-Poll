var gulp = require('gulp'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch');

gulp.task('default', function() {
  return gulp.src('./src/js/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function() {
  gulp.watch('./src/js/*.js', ['default'])
});
