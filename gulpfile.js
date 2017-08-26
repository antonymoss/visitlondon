//VARIABLES
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;
var autoPrefixer = require('gulp-autoprefixer');

var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss', //* any file in the folder
  htmlSource: 'src/*.html'
}

var APPPATHS = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
}
//=========================================================

gulp.task('sass', function() {
  return gulp.src(SOURCEPATHS.sassSource)                                      //IMPORTANT ORDER
    .pipe(autoPrefixer())                                                      //css auto prefix css3
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))          //expand sass output
    .pipe(gulp.dest('app/css'));                                               //where the sass will be compiled to
})

gulp.task('copy', function () {
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

gulp.task('watch', ['server', 'sass', 'copy'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);

});

gulp.task('default', ['watch']);                                               //passes 'watch' through the default
