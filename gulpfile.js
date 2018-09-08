'use strict';

// project folders
// /src 
//  |__/img
//  |__/sass
//  |__/js
//  |_index.pug


// build folder
//
// :::: path for IMG ::::
// background: #222 url('/img/tablet.jpg')
//
// /build
//  |__/img
//  |__/sass
//  |__/js
//  |_index.html
          

// other
let gulp    	= require('gulp'),
	watch       = require('gulp-watch'),
 	concat  	= require('gulp-concat'),
	rename   	= require('gulp-rename'),
	server  	= require('gulp-server-livereload'),
	del 		= require('del'),
	runSequence = require('run-sequence');

 // CSS plugins //
let CSSmin 	    = require('gulp-clean-css'),
	sass        = require('gulp-sass'),
 	uncss     	= require('gulp-uncss'),
 	prefix   	= require('gulp-autoprefixer');

 // JS plugins //
let JSmin       = require('gulp-jsmin'),
    babel       = require('gulp-babel'),
    JShint      = require('gulp-jshint');

// HTML plugins
let pug           = require('gulp-pug'),
	HTMLmin       = require('gulp-html-minifier');

// IMG plugins
let imageMin = require('gulp-imagemin');




let srcPath    = './src';
let buildPath  = './dist';


// img
gulp.task('img', () => {
	return gulp.src(`${srcPath}/img/*`)
		.pipe(gulp.dest(`${buildPath}/img`))
});
gulp.task('img-build', () => {
	return gulp.src(`${buildPath}/img/*`)
		.pipe(imageMin())
		.pipe(gulp.dest(`${buildPath}/img`))
});

// fonts
gulp.task('fonts', () => {
	return gulp.src(`${srcPath}/fonts/*`)
		.pipe(gulp.dest(`${buildPath}/fonts`))
});

// js
gulp.task('js', () => {
	return gulp.src(`${srcPath}/js/**/*.js`)
		.pipe(concat('bundle.js'))
		.pipe(JShint({ esversion: 6 }))
		.pipe(JShint.reporter()) // set up style errors type
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(`${buildPath}/js`));
});

gulp.task('js-build', () => {
	return  gulp.src(`${buildPath}/js/*.js`)
		.pipe(JSmin())
		.pipe(gulp.dest(`${buildPath}/js`))
});

// pug
gulp.task('pug', () => {
	return gulp.src(`${srcPath}/*.pug`)
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest(buildPath))
});

gulp.task('html-build', () => {
	return gulp.src(`${buildPath}/*.html`)
        .pipe(HTMLmin({
        	collapseWhitespace: true,
			removeComments: true
		}))
        .pipe(gulp.dest(buildPath))
});

// sass
gulp.task('sass', () => {
	return gulp.src(`${srcPath}/sass/main.sass`)
		.pipe(sass()).on('error', sass.logError)
		.pipe(prefix('last 3 versions'))
		.pipe(gulp.dest(`${buildPath}/css`));
});

gulp.task('css-build', () => {
	return gulp.src(`${buildPath}/css/*`)
		.pipe(uncss({
			html: [`${buildPath}/*.html`]
		}))
		.pipe(CSSmin())
		// .pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(`${buildPath}/css`))
});

// favicons and others 
gulp.task('copy', function() {
	return gulp.src([
			'src/*.html',
			'src/*.txt',
			'src/*.json',
			'src/*.xml',
			'src/*.ico',
			'src/*.png'

		])
		.pipe(gulp.dest('dist/'))
});

// copy fonts
gulp.task('fonts', function() {
	return gulp.src([
		'src/fonts/**/*.ttf',
		'src/fonts/**/*.woff',
		'src/fonts/**/*.woff2',
		'src/fonts/**/*.otf',
		'src/fonts/**/*.woff2'
		])
		.pipe(gulp.dest('dist/fonts/'))
});

// clean deploy path
gulp.task('clean:dist', () => {
	return del.sync('./dist');
});

// boxes
gulp.task('dev-box', ['pug', 'js', 'copy', 'sass', 'img', 'fonts']);
gulp.task('prod-box', ['html-build', 'copy', 'js-build', 'css-build', 'img-build', 'fonts']);

// watch
gulp.task('watch', () => {
	gulp.watch([`${srcPath}/sass/**/*.sass`, `${srcPath}/markup/**/*.sass`], ['sass']);
	gulp.watch(`${srcPath}/**/*.pug`, ['pug']);
	gulp.watch(`${srcPath}/fonts/**/*`, ['fonts']);
	gulp.watch(`${srcPath}/js/**/*.js`, ['js']);
	gulp.watch(`${srcPath}/img/**/*`, ['img']);
});

// server
gulp.task('server', () => {
	gulp.src(buildPath)
		.pipe(server({
			livereload: true,
			open: true
		}))
});

// build
gulp.task('build', () => {
	runSequence('clean:dist', 'dev-box', 'prod-box')
});

// dev
gulp.task('default', () => {
	runSequence('clean:dist', ['dev-box', 'watch'], 'server')
});