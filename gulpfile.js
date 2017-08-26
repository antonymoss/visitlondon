//VARIABLES
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;
var autoPrefixer = require('gulp-autoprefixer');
var clean        = require('gulp-clean');
var concat       = require('gulp-concat');
var browserify   = require('gulp-browserify');
var merge        = require('merge-stream');

var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',       //* any file in the folder
  htmlSource: 'src/*.html',
  jsSource:   'src/js/**'              //** listen to everything in that folder
}

var APPPATHS = {                       //object containing the repository folders
  root: 'app/',
  css:  'app/css',
  js:   'app/js',
  fonts: 'app/fonts'
}

/*=========================================================
RUN SASS & BROWSER SYNC
=========================================================*/

gulp.task('sass', function() {
  var bootstrapCss = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;

  sassFiles = gulp.src(SOURCEPATHS.sassSource)                                      //IMPORTANT ORDER
    .pipe(autoPrefixer())                                                      //css auto prefix css3
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))          //expand sass output

      return merge(bootstrapCss, sassFiles)
      .pipe(concat('app.css'))
      .pipe(gulp.dest('app/css'));                                               //where the sass will be compiled to
})

gulp.task('server', ['sass'], function() {
  browserSync.init([APPPATHS.css + '/*.css', APPPATHS.root + '/*.html', APPPATHS.js + '/*.js'], {
    server: {
      baseDir: APPPATHS.root
    }
  })
});

/*=========================================================
MOVE BOOTSRAP FONTS FROM DEPENDENCY TO WOKRING PROJECT
=========================================================*/

gulp.task('moveFonts', function () {
  gulp.src('./node_modules/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}')        //source
    .pipe(gulp.dest(APPPATHS.fonts))                                           //destination
})

/*=========================================================
COPY FILES FROM THE SRC REPO & DETECT WHEN DELETED
=========================================================*/

gulp.task('copy', ['clean-html'], function () {
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATHS.root))
})

gulp.task('scripts', ['clean-scripts'], function () {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))                                                   //compress js files into one file called main.js
    .pipe(browserify())                                                        //includes bootsrap, jquery, & mustache js
    .pipe(gulp.dest(APPPATHS.js))
})

gulp.task('clean-html', function () {
  return gulp.src(APPPATHS.root + '/*.html', {read: false, force: true })      //delete files from the root globally
    .pipe(clean());
})

gulp.task('clean-scripts', function () {
  return gulp.src(APPPATHS.js + '/*.js', {read: false, force: true })          //delete files from the root globally
    .pipe(clean());
})

/*=========================================================
WATCH ALL FUNCTIONS & PASS THROUGH THE 'default'
=========================================================*/

gulp.task('watch', ['server', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts', 'moveFonts' ], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);

});

gulp.task('default', ['watch']);                                               //passes 'watch' through the default
