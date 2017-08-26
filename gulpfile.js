//VARIABLES
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;
var autoPrefixer = require('gulp-autoprefixer');
var clean        = require('gulp-clean');

var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',       //* any file in the folder
  htmlSource: 'src/*.html',
  jsSource: 'src/js/**'                //** listen to everything in that folder
}

var APPPATHS = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
}

//=========================================================

gulp.task('clean-html', function () {
  return gulp.src(APPPATHS.root + '/*.html', {read: false, force: true })      //delete files from the root globally
    .pipe(clean());
})

gulp.task('clean-scripts', function () {
  return gulp.src(APPPATHS.js + '/*.js', {read: false, force: true })          //delete files from the root globally
    .pipe(clean());
})

gulp.task('sass', function() {
  return gulp.src(SOURCEPATHS.sassSource)                                      //IMPORTANT ORDER
    .pipe(autoPrefixer())                                                      //css auto prefix css3
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))          //expand sass output
    .pipe(gulp.dest('app/css'));                                               //where the sass will be compiled to
})

gulp.task('scripts', ['clean-scripts'], function () {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(gulp.dest(APPPATHS.js))
})

gulp.task('copy', ['clean-html'], function () {
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATHS.root))
})

gulp.task('server', ['sass'], function() {
  browserSync.init([APPPATHS.css + '/*.css', APPPATHS.root + '/*.html', APPPATHS.js + '/*.js'], {
    server: {
      baseDir: APPPATHS.root
    }
  })
});

gulp.task('watch', ['server', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts' ], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);

});

gulp.task('default', ['watch']);                                               //passes 'watch' through the default
