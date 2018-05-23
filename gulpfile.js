const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const buffer = require('vinyl-buffer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const rollup = require('rollup-stream');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;

// rollup plugins
const resolveNodeModules = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');


// configure directories and files to be used with tasks
const css_src = './assets_src/sass/*.scss'
const css_dest = './assets/css'
const css_watch = './assets_src/sass/**/**/*.scss'

const img_src = './assets_src/img/*'
const img_dest = './assets/img'

const html_watch = './**/**/*.html'

const js_lib_src = './assets_src/js/lib/*.js'
const js_lib_filename = 'libraries.js'
const js_lib_dest = './assets/js'

const js_custom_src = [
  './assets_src/js/components/*.js', // components in this directory will be concatenated in alphabetical order
  './assets_src/js/app.js'
]
const js_custom_filename = 'app.js'
const js_custom_dest = './assets/js'

const js_watch = './assets_src/js/**/**/*.js'
const js_about_watch = './about/js/*.js'

const rollup_file = 'app.js'
const rollup_src = './assets_src/js/'
const rollup_dest = './assets/js/'



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


// rollup
const rollupJS = (inputFile, options) => {
  return () => {
    return rollup({
      input: options.basePath + inputFile,
      format: options.format,
      sourcemap: options.sourcemap,
      plugins: [
        babel(),
        resolveNodeModules()
      ]
    })
      .pipe(plumber()) // prevent task from exiting the stream on error
      .pipe(source(inputFile, options.basePath)) // point to the entry file.
      .pipe(buffer()) // we need to buffer the output, since many gulp plugins don't support streams.
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(options.distPath))
      .pipe(browserSync.stream());
  };
}

gulp.task('js-rollup', rollupJS(rollup_file, {
  basePath: rollup_src,
  format: 'iife',
  distPath: rollup_dest,
  sourcemap: true
}));

// js
gulp.task('js', function () {
  gulp.start('js-lib');
  gulp.start('js-rollup');
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
  gulp.watch(css_watch, ['css']);
  gulp.watch(js_watch, ['js']);
  gulp.watch(img_src, ['images']);
  gulp.watch(html_watch, ['reload']);
  gulp.watch(js_about_watch, ['reload'])
});

// default task run using 'gulp'
gulp.task('default', ['css', 'js', 'images', 'browserSync', 'watch'], function () {});

// task for processing all the assets without starting a local server
gulp.task('build', ['css', 'js', 'images'], function () {});