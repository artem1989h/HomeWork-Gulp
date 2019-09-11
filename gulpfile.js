// src/
    // js/
    // scss/
    // img/
    // index.html/
// dist/
// gulpfile.js/

    
const gulp = require("gulp"); //завантажити локальний галп

const sass =require("gulp-sass");

sass.compiler = require('node-sass');

const concat = require('gulp-concat');

const browserSync = require('browser-sync').create();

const zip = require('gulp-zip');

const autoprefixer = require('gulp-autoprefixer');

const imagemin = require('gulp-imagemin');

const pngquant = require('imagemin-pngquant');

const cache = require('gulp-cache');

const babel = require('gulp-babel');


gulp.task("html", (done) => {
    // завантажити файл у память
    return gulp.src("./src/*.html")
    // вигрузити у іншу директорію
        .pipe(gulp.dest("./dist")) //тільки шлях
        .pipe(browserSync.stream());
});

gulp.task("images", (done) => {
     return gulp.src("./src/img/**/*")
        .pipe(cache(imagemin(
         [pngquant({quality: [0.5, 0.5]})]
     )))
        .pipe(gulp.dest("./dist/img"));
        
});


gulp.task("scss", (done) =>{
    return gulp.src("./src/scss/**/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['last 10 versions'], {
            cascade: true
        }))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
});

gulp.task("js", (done) => {
    return gulp.src("./src/js/**/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('index.js'))
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.stream());
});

gulp.task("browser-init", (done) => {
    return browserSync.init({
        server:  "./dist"
    });
});

gulp.task("watch", (done) => {
    gulp.watch("./src/*.html", gulp.series("html"));
    gulp.watch("./src/scss/**/*.scss", gulp.series("scss"));
    gulp.watch("./src/js/**/*/.js", gulp.series("js"));
    gulp.watch("./src/img/**/*", gulp.series("images"));
    return;
});

gulp.task("deploy", (done) => {
    return gulp.src("./dist/**/*")
        .pipe(zip('deploy.zip'))
        .pipe(gulp.dest("./"));
})

gulp.task("default", gulp.series("html", "scss", "js", "images", "browser-init", "watch"));



