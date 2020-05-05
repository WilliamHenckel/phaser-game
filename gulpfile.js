var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var gutil = require("gulp-util");

// JAVASCRIPT
gulp.task("default", function (done) {
  done();
});
gulp.task("concat-js", function () {
  return gulp
    .src([
      "./js/boot.js",
      "./js/load.js",
      "./js/menu.js",
      "./js/trophy.js",
      "./js/help.js",
      "./js/character.js",
      "./js/difficulty.js",
      "./js/level.js",
      "./js/play.js",
      "./js/game.js",
    ])
    .pipe(concat("dist.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task(
  "minify-js",
  gulp.series("concat-js", function (done) {
    gulp
      .src("./dist/dist.js")
      .pipe(
        babel({
          presets: ["es2015"],
        })
      )
      .pipe(uglify())
      .on("error", function (err) {
        gutil.log(gutil.colors.red("[Error]"), err.toString());
      })
      .pipe(gulp.dest("dist"));
    done();
  })
);

gulp.task("prod-js", gulp.series("concat-js", "minify-js"));

// COPY FILES
gulp.task("copy-assets", function (done) {
  gulp.src(["assets/**/*"]).pipe(gulp.dest("./dist/assets"));
  done();
});

gulp.task("copy-css", function (done) {
  gulp.src(["css/**/*"]).pipe(gulp.dest("dist"));
  done();
});

gulp.task("copy-all", gulp.series("copy-assets", "copy-css"));

// FINAL COMMAND
gulp.task("dist", gulp.series("prod-js", "copy-all"));

// WATCH
gulp.task("watch", function () {
  gulp.watch(["./assets/**/*", "./css/**/*", "./js/**/*"], ["dist"]);
});
