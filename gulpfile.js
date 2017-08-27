//TABLE OF content
// 1: IMPORT GULP LIBRARIES
// 2: OBJECTS
// 3: COMPRESS CSS & HTML
// 4: BROWSER SYNC
// 5: MOVE BOOTSRAP FONTS FROM DEPENDENCY TO WOKRING PROJECT
// 6: COPY & COMPRESS IMAGES
// 7: HTML PARTIALS
// 8: COPY SCRIPTS INTO main.js & THEN COMPRESS INTO main-min.js
// 9: COPY FILES FROM THE SRC REPO & DETECT WHEN DELETED
// 10: WATCH ALL FUNCTIONS DURING THE PRODUCTION PROCESS
// 11: EXECUTE PRODUCTION TASK WHEN ALL WORK IS COMPLETE BEFORE UPLOADING TO SERVER

// 1: IMPORT GULP LIBRARIES
var gulp           = require('gulp');
var sass           = require('gulp-sass');
var browserSync    = require('browser-sync');
var reload         = browserSync.reload;
var autoprefixer   = require('gulp-autoprefixer');
var clean          = require('gulp-clean');
var concat         = require('gulp-concat');
var browserify     = require('gulp-browserify');
var merge          = require('merge-stream');
var newer          = require('gulp-newer');
var imagemin       = require('gulp-imagemin');
var injectPartials = require('gulp-inject-partials');
var minify         = require('gulp-minify');
var rename         = require('gulp-rename');
var cssmin         = require('gulp-cssmin');
var htmlmin        = require('gulp-htmlmin');

// 2: OBJECTS
var SOURCE    = {
  sassSource:        'src/scss/*.scss',          //* any file in the folder
  htmlSource:        'src/*.html',
  htmlPartialSource: 'src/partial/*.html',
  jsSource:          'src/js/**',                //** listen to everything in that folder
  imgSource:         'src/img/**'
}

var PROJECT        = {                           //object containing the repository folders
  root:              'project/',
  css:               'project/css',
  js:                'project/js',
  fonts:             'project/fonts',
  img:               'project/img'
}

/*=========================================================
3: COMPRESS CSS & HTML
=========================================================*/

gulp.task('sass', function() {
  var bootstrapCss = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;

  sassFiles = gulp.src(SOURCE.sassSource)                                      //IMPORTANT ORDER
    .pipe(autoprefixer())                                                      //css auto prefix css3
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))          //expand sass output
      return merge(bootstrapCss, sassFiles)
      .pipe(concat('project.css'))                                                 //concat bootsrap css & custom
      .pipe(gulp.dest('project/css'));                                             //where the sass will be compiled to
});

/** Production Tasks **/
gulp.task('compress',  function() {
  gulp.src(SOURCE.jsSource)
      .pipe(concat('main.js'))
      .pipe(browserify())
      .pipe(minify())
      .pipe(gulp.dest(PROJECT.js))
});

gulp.task('compresscss', function(){
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;
  sassFiles = gulp.src(SOURCE.sassSource)
      .pipe(autoprefixer())
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      return merge(bootstrapCSS, sassFiles)
          .pipe(concat('project.css'))
          .pipe(cssmin())
          .pipe(rename({suffix: '.min'}))
          .pipe(gulp.dest(PROJECT.css));
});

gulp.task('minifyHtml', function() {
   return gulp.src(SOURCE.htmlSource)
        .pipe(injectPartials())
        .pipe(htmlmin({collapseWhitespace:true}))
        .pipe(gulp.dest(PROJECT.root))
});

/*=========================================================
4: BROWSER SYNC
=========================================================*/

gulp.task('server', ['sass'], function() {
  browserSync.init([PROJECT.css + '/*.css', PROJECT.root + '/*.html', PROJECT.js + '/*.js'], {
    server: {
      baseDir: PROJECT.root
    }
  })
});

/*=========================================================
5: MOVE BOOTSRAP FONTS FROM DEPENDENCY TO WOKRING PROJECT
=========================================================*/

gulp.task('moveFonts', function () {
  gulp.src('./node_modules/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}')        //source
    .pipe(gulp.dest(PROJECT.fonts))                                           //destination
});

/*=========================================================
6: COPY & COMPRESS IMAGES
=========================================================*/

gulp.task('images', function () {
  return gulp.src(SOURCE.imgSource)
  .pipe(newer(PROJECT.img))
  .pipe(imagemin())
  .pipe(gulp.dest(PROJECT.img));
});

/*=========================================================
7: HTML PARTIALS
=========================================================*/

gulp.task('html', function () {
  return gulp.src(SOURCE.htmlSource)
  .pipe(injectPartials())
  .pipe(gulp.dest(PROJECT.root))
});

/*=========================================================
8: COPY SCRIPTS INTO main.js & THEN COMPRESS INTO main-min.js
=========================================================*/

gulp.task('scripts', ['clean-scripts'], function () {
  gulp.src(SOURCE.jsSource)
    .pipe(concat('main.js'))                                                   //concat js files into one file called main.js
    .pipe(browserify())                                                        //includes bootsrap, jquery, & mustache js
    .pipe(gulp.dest(PROJECT.js))
});

gulp.task('compress', function () {
  gulp.src(SOURCE.jsSource)
    .pipe(concat('main.js'))                                                   //compress js files into one file called main.js
    .pipe(minify())
    .pipe(gulp.dest(PROJECT.js))
});

/*=========================================================
9: COPY FILES FROM THE SRC REPO & DETECT WHEN DELETED
=========================================================*/

// gulp.task('copy', ['clean-html'], function () {
//   gulp.src(SOURCE.htmlSource)
//     .pipe(gulp.dest(PROJECT.root))
// });

gulp.task('clean-html', function () {
  return gulp.src(PROJECT.root + '/*.html', {read: false, force: true })      //delete files from the root globally
    .pipe(clean());
});

gulp.task('clean-scripts', function () {
  return gulp.src(PROJECT.js + '/*.js', {read: false, force: true })          //delete files from the root globally
    .pipe(clean());
});

/*=========================================================
10: WATCH ALL FUNCTIONS DURING THE PRODUCTION PROCESS
=========================================================*/

gulp.task('watch', ['server', 'sass', 'clean-html', 'html', 'clean-scripts', 'scripts', 'moveFonts', 'images' ], function() {
  gulp.watch([SOURCE.sassSource], ['sass']);
  // gulp.watch([SOURCE.htmlSource], ['copy']);
  gulp.watch([SOURCE.jsSource], ['scripts']);
  gulp.watch([SOURCE.imgSource], ['images']);
  gulp.watch([SOURCE.htmlSource, SOURCE.htmlPartialSource], ['html']);

});

gulp.task('default', ['watch']);                                               //passes 'watch' through the default

/*=========================================================
11: EXECUTE PRODUCTION TASK WHEN ALL WORK IS COMPLETE BEFORE UPLOADING TO SERVER
=========================================================*/

gulp.task('production', ['compress', 'compresscss', 'minifyHtml']);
