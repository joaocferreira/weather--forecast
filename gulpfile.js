var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');

gulp.task('sass', function() {
    return gulp.src('./app/styles/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./app/styles'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

gulp.task('cleanCSS', function() {
    return gulp.src('./app/styles/main.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist/styles'))
})

gulp.task('server--dev', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
})

gulp.task('server--dist', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
})

gulp.task('browserify', function() {
    return browserify('./app/scripts/main.js')
        .bundle()
        .on('error', function(e) {
            gutil.log(e);
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./app/scripts'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

gulp.task('copy', function() {
    return gulp.src('./app/*.html')
        .pipe(gulp.dest('./dist'))
});

gulp.task('uglify', function() {
    return gulp.src('./app/scripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/scripts'))
});

gulp.task('dev', ['server--dev', 'sass', 'browserify'], function() {
    gulp.watch('./app/styles/*.scss', ['sass']);
    gulp.watch('./app/*.html', browserSync.reload);
    gulp.watch('./app/scripts/*.js', ['browserify']);
})

gulp.task('build', ['sass', 'browserify', 'cleanCSS', 'copy', 'uglify', 'server--dist']);
