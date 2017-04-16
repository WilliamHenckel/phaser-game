var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var paths = {
  files: ['assets/']
};

// JAVASCRIPT
gulp.task('concat-js', function () {
    return gulp.src([
      './js/boot.js',
      './js/load.js',
      './js/menu.js',
      './js/character.js',
      './js/play.js',
      './js/game.js'
    ])
    .pipe(concat('dist.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-js', ['concat-js'], function () {
    gulp.src('./dist/dist.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('prod-js', ['concat-js', 'minify-js']);

// COPY FILES
gulp.task('copy-assets', function() {
   gulp.src([
     'assets/**/*'
   ])
   .pipe(gulp.dest('./dist/assets'));
});

gulp.task('copy-css', function() {
   gulp.src([
     'css/**/*'
   ])
   .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-phaser', function() {
   gulp.src([
     'phaser.min.js'
   ])
   .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-all', ['copy-assets', 'copy-css', 'copy-phaser']);

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
