'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var gulpIf = require('gulp-if');

gulp.task('sass', function () {
  gulp.src('src/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('public/css/'))
});

gulp.task('default', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
});
