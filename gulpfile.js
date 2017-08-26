//VARIABLES
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss' //* any file in the folder
}

var APPPATHS = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
}
//=========================================================

gulp.task('sass', function() {
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('app/css')); //where the sass will be compiled to
})

gulp.task('server', ['sass'], function() {
  browserSync.init([APPPATHS.css + '/*.css', APPPATHS.root + '/*.html', APPPATHS.js + '/*.js'], {
    server: {
      baseDir: APPPATHS.root
    }
  })
});

gulp.task('watch', ['server', 'sass'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
});

gulp.task('default', ['watch']); //adds the tasks to the default request
