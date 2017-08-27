//VARIABLES – IMPORT LIBRARIES
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;
var autoPrefixer = require('gulp-autoprefixer');
var clean        = require('gulp-clean');
var concat       = require('gulp-concat');
var browserify   = require('gulp-browserify');
var merge        = require('merge-stream');
var newer        = require('gulp-newer');
var imagemin     = require('gulp-imagemin');

var SOURCEPATHS = {
  sassSource:     'src/scss/*.scss',       //* any file in the folder
  htmlSource:     'src/*.html',
  jsSource:       'src/js/**',              //** listen to everything in that folder
  imgSource:      'src/img/**'
}


var APPATHS    = {                       //object containing the repository folders
  root:           'app/',
  css:            'app/css',
  js:             'app/js',
  fonts:          'app/fonts',
  img:            'app/img'
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
  browserSync.init([APPATHS.css + '/*.css', APPATHS.root + '/*.html', APPATHS.js + '/*.js'], {
    server: {
      baseDir: APPATHS.root
    }
  })
});

/*=========================================================
MOVE BOOTSRAP FONTS FROM DEPENDENCY TO WOKRING PROJECT
=========================================================*/

gulp.task('moveFonts', function () {
  gulp.src('./node_modules/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}')        //source
    .pipe(gulp.dest(APPATHS.fonts))                                           //destination
});

/*=========================================================
COPY & COMPRESS IMAGES
=========================================================*/

gulp.task('images', function () {
  return gulp.src(SOURCEPATHS.imgSource)
  .pipe(newer(APPATHS.img))
  .pipe(imagemin())
  .pipe(gulp.dest(APPATHS.img));
});

/*=========================================================
COPY FILES FROM THE SRC REPO & DETECT WHEN DELETED
=========================================================*/

gulp.task('copy', ['clean-html'], function () {
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPATHS.root))
});

gulp.task('scripts', ['clean-scripts'], function () {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))                                                   //compress js files into one file called main.js
    .pipe(browserify())                                                        //includes bootsrap, jquery, & mustache js
    .pipe(gulp.dest(APPATHS.js))
});

gulp.task('clean-html', function () {
  return gulp.src(APPATHS.root + '/*.html', {read: false, force: true })      //delete files from the root globally
    .pipe(clean());
});

gulp.task('clean-scripts', function () {
  return gulp.src(APPATHS.js + '/*.js', {read: false, force: true })          //delete files from the root globally
    .pipe(clean());
});

/*=========================================================
WATCH ALL FUNCTIONS & PASS THROUGH THE 'default'
=========================================================*/

gulp.task('watch', ['server', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts', 'moveFonts', 'images' ], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);

});

gulp.task('default', ['watch']);                                               //passes 'watch' through the default
