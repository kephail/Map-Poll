var gulp = require('gulp'),
    concat = require('gulp-concat');

gulp.task('default', function() {
  return gulp.src('./src/js/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./public/js/'));
});
