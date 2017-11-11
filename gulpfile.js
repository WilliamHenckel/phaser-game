var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gutil = require('gulp-util');

// JAVASCRIPT
gulp.task('concat-js', function () {
  return gulp.src([
    './js/boot.js',
    './js/load.js',
    './js/menu.js',
    './js/trophy.js',
    './js/help.js',
    './js/character.js',
    './js/difficulty.js',
    './js/level.js',
    './js/play.js',
    './js/game.js'
  ])
    .pipe(concat('dist.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-js', ['concat-js'], function () {
  gulp.src('./dist/dist.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('dist'));
});

gulp.task('prod-js', ['concat-js', 'minify-js']);

// COPY FILES
gulp.task('copy-assets', function () {
  gulp.src([
    'assets/**/*'
  ])
  .pipe(gulp.dest('./dist/assets'));
});

gulp.task('copy-css', function () {
  gulp.src([
    'css/**/*'
  ])
  .pipe(gulp.dest('dist'));
});

gulp.task('copy-all', ['copy-assets', 'copy-css']);

// FINAL COMMAND
gulp.task('dist', ['prod-js', 'copy-all']);

// WATCH
gulp.task('watch', function () {
  gulp.watch([
    './assets/**/*',
    './css/**/*',
    './js/**/*'
  ], ['dist']);
});
