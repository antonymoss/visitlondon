//VARIABLES
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('src/scss/app.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest('.app/css'));//where the sass will be compiled to
})

gulp.task('default', ['sass', 'task1', 'task2']);//adds the tasks to the default request
