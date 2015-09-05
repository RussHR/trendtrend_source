// use process.stdout.write instead of console.log

// Gulp
var gulp = require('gulp');

// gulp modules
var autoprefix = require('gulp-autoprefixer');
var babelify = require('babelify');
var browserify = require('browserify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var minifycss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

// copy index.html and favicon
gulp.task('copy', function() {
    gulp.src('src/favicon.ico')
        .pipe(gulp.dest('dist'));
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

// compile Sass
gulp.task('sass', function() {
  gulp.src(['src/components/**/*.scss'])
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(concat('trendtrend.css'))
    // .pipe(minifycss())
    .pipe(gulp.dest("dist/assets"))
    .pipe(connect.reload());
});

// compile es6/jsx
gulp.task('scripts', function() {
    browserify({
        entries: 'src/index.jsx',
        extensions: ['.jsx'],
        debug: true
    })
        .transform(babelify)
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('dist/assets'))
        .pipe(connect.reload());
});

// connect
gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        port: 8000,
        livereload: true
    });
});

// Watch files
gulp.task('watch', function(event) {
  gulp.watch(['src/components/**/*.scss'], ['sass']);
  gulp.watch(['src/index.html', 'favicon.ico'], ['copy']);
  gulp.watch(['src/**/*.jsx'], ['scripts']);
});

gulp.task('default', ['connect', 'watch']);