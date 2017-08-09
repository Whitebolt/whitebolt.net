'use strict';

const config = require('./package.json');
const angularBoltConfig = require('./lib/angular-bolt/package.json');
const sftpConfig = require('./sftp.json');
const fs = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const header = require('gulp-header');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const babel = require("gulp-babel");
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const sftp = require('gulp-sftp-new');
const livereload = require('gulp-livereload');
const gulpif = require('gulp-if');
const replace = require('gulp-replace');

config.gulp.source.scripts = angularBoltConfig.srcRoots
	.map(item=>item.replace(/^\./, './lib/angular-bolt'))
	.concat(config.gulp.source.scripts);

config.gulp.deployment = {
	"scripts": Object.assign({}, config.gulp.deployment, {
		remotePath: config.gulp.deployment.remotePath + '/' + config.gulp.build.scripts
	}, sftpConfig),
	"styles": Object.assign({}, config.gulp.deployment, {
		remotePath: config.gulp.deployment.remotePath + '/' + config.gulp.build.styles
	}, sftpConfig)
};

function randomString(length=32) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

	if (! length) {
		length = Math.floor(Math.random() * chars.length);
	}

	var str = '';
	for (var i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}
	return str;
}

function doSass(deploy=false) {
	return gulp.src(config.gulp.source.styles)
		.pipe(sourcemaps.init())
		.pipe(sass(config.gulp.build.sass).on('error', gutil.log))
		.pipe(cleanCSS(config.gulp.build.cleanCss))
		.pipe(rename(path=>{path.basename = config.gulp.build.styleRename}))
		.pipe(sourcemaps.write('./', {
			loadMaps: true,
			mapFile: file=>file + '?cacheBust=' + randomString()
		}))
		.pipe(gulp.dest(config.gulp.build.styles))
		.pipe(gulpif(deploy, sftp(config.gulp.deployment.styles)))
		.on('end', ()=>{
			let stylesHeader = fs.readFileSync('./src/header.txt', 'utf8');
			return gulp.src(['./style.css'])
				.pipe(header(stylesHeader))
				.pipe(gulp.dest('./'))
				.pipe(gulpif(deploy, sftp(config.gulp.deployment.styles)))
				.pipe(livereload())
		})
}

function doMinify(deploy=false) {
	return gulp.src(config.gulp.source.scripts)
		//.pipe(debug())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(concat((config.gulp.build.index || 'index') + '.js'))
		.pipe(sourcemaps.write('./', {
			loadMaps: true,
			mapFile: file=>file + '?cacheBust=' + randomString()
		}))
		.pipe(gulp.dest(config.gulp.build.scripts))
		.pipe(gulpif(deploy, sftp(config.gulp.deployment.scripts)))
		.on('end', ()=>gulp.src(config.gulp.source.scripts)
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(concat((config.gulp.build.index || 'index') + '.min.js'))
			.pipe(babel())
			.pipe(uglify().on('error', gutil.log))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(config.gulp.build.scripts))
			.pipe(gulpif(deploy, sftp(config.gulp.deployment.scripts)))
			.pipe(livereload())
		);
}

gulp.task('minify', ()=>doMinify());
gulp.task('minify-deply', ()=>doMinify(true));
gulp.task('sass', ()=>doSass());
gulp.task('sass-deploy', ()=>doSass(true));

gulp.task('watch', ()=>{
	livereload.listen();
	gulp.watch(config.gulp.source.scriptsWatch, ['minify']);
	gulp.watch(config.gulp.source.stylesWatch, ['sass']);
});

gulp.task('watch-deploy', ()=>{
	livereload.listen();
	gulp.watch(config.gulp.source.scriptsWatch, ['minify-deploy']);
	gulp.watch(config.gulp.source.stylesWatch, ['sass-deploy']);
});

gulp.task('build', ['minify', 'sass']);
gulp.task('build-deploy', ['minify-deploy', 'sass-deploy']);
