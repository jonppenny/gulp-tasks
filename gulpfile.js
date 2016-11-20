'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
var sourceMaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useRef = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssNano = require('gulp-cssnano');
var imageMin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: './public'
        }
    });
});

gulp.task('sass', function () {
    return gulp.src('./resources/assets/sass/app.scss')
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoPrefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpIf('*.css', cssNano()))
        .pipe(sourceMaps.write('./'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function () {
    gulp.watch('./resources/assets/sass/**/*.scss', ['sass']);
    gulp.watch('./resources/assets/js/**/*.js', ['js']);
});

gulp.task('js', function () {
    return gulp.src('./resources/assets/js/**/*.js')
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('./public'));
});

gulp.task('images', function () {
    return gulp.src('./resources/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imageMin({
            interlaced: true
        })))
        .pipe(gulp.dest('./public/images'));
});

gulp.task('fonts', function () {
    return gulp.src('./resources/assets/fonts/**/*')
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('clean', function () {
    return del.sync('./public').then(function (cb) {
        return cache.clearAll(cb);
    });
});

gulp.task('clean:dist', function () {
    return del.sync(['./public/**/*', '!./public/images', '!./public/images/**/*']);
});

gulp.task('default', function (callback) {
    runSequence(
        'clean:dist',
        ['sass', 'js'],
        'watch',
        callback
    );
});

gulp.task('build', function (callback) {
    runSequence(
        'clean:dist',
        'sass',
        'js',
        ['images', 'fonts'],
        callback
    );
});
