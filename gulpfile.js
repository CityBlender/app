const browserSync = require('browser-sync')
const gulp = require('gulp')

// list directories and filetypes to watch for changes
const watch_files = ['js/**/*.js', 'css/**/*.css', '*.html', 'img/*']

// task for reloading the browser on change
gulp.task('reload', function () {
  browserSync.reload();
});


// default task run using 'gulp'
gulp.task('default', function () {

  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  // run reload task on file change
  gulp.watch(watch_files, ['reload']);
});