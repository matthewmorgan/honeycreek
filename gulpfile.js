const gulp = require('gulp'),
    inputDir = 'public/scss',
    outputDir = 'public/css';

// Gulp tasks definition

gulp.task('default', [ 'move-css' ]);

gulp.task('move-css', function () {
  return gulp.src([ inputDir + '/*.css' ])
      .pipe(gulp.dest(outputDir));
});


