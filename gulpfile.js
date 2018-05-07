'use strict';
var config       = require('./config.json');
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
var sourceMaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync');
var uglify       = require('gulp-uglify');
var gulpIf       = require('gulp-if');
var cssNano      = require('gulp-cssnano');
var concat       = require('gulp-concat');
var imageMin     = require('gulp-imagemin');
var cache        = require('gulp-cache');
var del          = require('del');
var runSequence  = require('run-sequence');
var babel        = require('gulp-babel');

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: './public'
        }
    });
});

gulp.task('sass', function () {
    return gulp.src(config.sass.src)
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoPrefixer({
            browsers: ['last 2 versions'],
            cascade:  false
        }))
        .pipe(gulpIf('*.css', cssNano()))
        .pipe(sourceMaps.write('./'))
        .pipe(gulp.dest(config.sass.dest));
});

gulp.task('watch', function () {
    gulp.watch(config.sass.watch, ['sass']);
    gulp.watch(config.js.watch, ['js']);
});

gulp.task('js', function () {
    // return gulp.src('./resources/assets/js/**/*.js')
    return gulp.src(config.js.src)
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('app.js'))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest(config.js.dest));
});

gulp.task('images', function () {
    return gulp.src(config.images.src)
        .pipe(cache(imageMin({
            interlaced: true
        })))
        .pipe(gulp.dest(config.images.dest));
});

gulp.task('fonts', function () {
    return gulp.src(config.fonts.src)
        .pipe(gulp.dest(config.fonts.dest));
});

gulp.task('clean', function () {
    return del.sync('./public').then(function (cb) {
        return cache.clearAll(cb);
    });
});

gulp.task('clean:dist', function () {
    return del.sync(config.clean);
});

gulp.task('default', function (callback) {
    runSequence(
        ['sass', 'js'],
        'watch',
        callback
    );
});

gulp.task('build', function (callback) {
    runSequence(
        'sass',
        'js',
        ['images', 'fonts'],
        callback
    );
});
