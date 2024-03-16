const {src, dest, series, watch} = require('gulp')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del');
const sync = require('browser-sync').create();
const concat = require('gulp-concat');


const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const sass = gulpSass(dartSass);

function html() {
    return src('src/**.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('dist'))
}

function scss() {
    return src('src/scss/**.scss')
        .pipe(sass())
        .pipe(csso())
        .pipe(concat('index.css'))
        .pipe(dest('dist'))
}

function copyImages() {
    return src('src/image/**')
        .pipe(dest('dist/image'));
}

function copyFonts() {
    return src('src/fonts/**/*')
        .pipe(dest('dist/fonts'));
}

function js () {
    return src('src/js/**/*')
        .pipe(dest('dist/js'));
}


function clear() {
    return del('dist')
}

function serve() {
    sync.init({
        server: './dist'
    })
    watch('src/**/*.html', series(html)).on('change', sync.reload)
    watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
    watch('src/js/**.js', series(js)).on('change', sync.reload)
}

exports.build = series(clear, scss, js, html, copyImages, copyFonts )
exports.serve = series(clear, scss, js, html, copyImages, copyFonts, serve)
// exports.copyAssets = copyAssets;
exports.clear = clear;