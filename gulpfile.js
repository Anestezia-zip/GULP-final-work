
const gulp = require('gulp');
const { series, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');


const html = () => {
	return gulp.src('src/pug/**/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('build'))
}

const styles = () => {
	return gulp.src('src/styles/**/*.scss')
		.pipe (sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(rename( { suffix: '.min' } ))
		.pipe(gulp.dest('build/css'))
}

const fonts = () => {
	return gulp.src('src/styles/fonts/**/*.*')
		.pipe(gulp.dest('build/fonts'))
}

const img = () => {
	return gulp.src('src/img/**/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest('build/img'))
}

const server = () => {
	browserSync.init({
		server: {
			baseDir: './build'
		},
		notify: false
	});
	browserSync.watch('build/**/*.*').on('change', browserSync.reload);
}

const deleteBuild = (cb) => {
	return del('build/**/*.*').then(() => { cb() })
}

const watch = () => {
	gulp.watch('src/pug/**/*.pug', html);
	gulp.watch('src/styles/**/*.scss', styles);
	gulp.watch('src/img/**/*.*', img);
}

exports.default = series(
	deleteBuild,
	parallel(html, styles, img, fonts),
	parallel(server, watch)
)