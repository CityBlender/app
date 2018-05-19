const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');


// configure directories and files to be used with tasks
const css_src = './assets_src/sass/*.scss'
const css_dest = './assets/css'

const img_src = './assets_src/img/*'
const img_dest = './assets/img'

const js_lib_src = './assets_src/js/lib/*.js'
const js_lib_filename = 'libraries.js'
const js_lib_dest = './assets/js'

const js_custom_src = [
  './assets_src/js/components/*.js', // components in this directory will be concatenated in alphabetical order
  './assets_src/js/app.js'
]
const js_custom_filename = 'app.js'
const js_custom_dest = './assets/js'

const js_watch = './assets_src/js/*'



// task for reloading the browser on change
gulp.task('reload', function () {
  browserSync.reload();
});


// browsersync
gulp.task('browserSync', function() {
  // Serve files from the root of the project
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});


// css
gulp.task('css', function() {
  return gulp.src(css_src)
    .pipe(plumber()) // prevent task from exiting the stream on error
    .pipe(sourcemaps.init()) // initialize sourcemaps
    .pipe(sass().on('error', sass.logError)) // compile sass
    .pipe(autoprefixer({cascade: false})) // add vendor prefixes - supported browsers are listed in package.json
    .pipe(cleanCSS()) // minify CSS
    .pipe(sourcemaps.write('./')) // write sourcemaps
    .pipe(gulp.dest(css_dest)) // save
    .pipe(browserSync.stream()); // reload browser
});


// js-lib
gulp.task('js-lib', function() {
  return gulp.src(js_lib_src)
    .pipe(plumber()) // prevent task from exiting the stream on error
    .pipe(sourcemaps.init()) // initialize sourcemaps
    .pipe(concat(js_lib_filename)) // concat
    .pipe(sourcemaps.write('./')) // write sourcemaps
    .pipe(gulp.dest(js_lib_dest)) // save
    .pipe(browserSync.stream()); // reload browser
});


// js-main
gulp.task('js-custom', function() {
  return gulp.src(js_custom_src)
    .pipe(plumber()) // prevent task from exiting the stream on error
    .pipe(sourcemaps.init()) // initialize sourcemaps
    .pipe(concat(js_custom_filename)) // concat
    .pipe(sourcemaps.write('./')) // write sourcemaps
    .pipe(gulp.dest(js_custom_dest)) // save
    .pipe(browserSync.stream()); // reload browser
});

// js
gulp.task('js', function () {
  gulp.start('js-lib');
  gulp.start('js-custom');
});

// images
gulp.task('images', function () {
  return gulp.src(img_src)
    .pipe(plumber()) // prevent task from exiting the stream on error
    .pipe(imagemin()) // optimize images
    .pipe(gulp.dest(img_dest)) // save
    .pipe(browserSync.stream()); // reload browser
});


// watch
gulp.task('watch', function () {
  gulp.watch(css_src, ['css']);
  gulp.watch(js_watch, ['js']);
  gulp.watch(img_src, ['images']);
  gulp.watch('*.html', ['reload']);
});

// default task run using 'gulp'
gulp.task('default', ['css', 'js', 'images', 'browserSync', 'watch'], function () {});

// task for processing all the assets without starting a local server
gulp.task('build', ['css', 'js', 'images'], function () {});