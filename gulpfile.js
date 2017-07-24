'use strict';

const config = require('./package.json');
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


config.gulp.deployment = {
	"scripts": Object.assign({}, config.gulp.deployment, {
		remotePath: config.gulp.deployment.remotePath + '/' + config.gulp.build.scripts
	}, sftpConfig),
	"styles": Object.assign({}, config.gulp.deployment, {
		remotePath: config.gulp.deployment.remotePath + '/' + config.gulp.build.styles
	}, sftpConfig)
};

gulp.task('sass', ()=>gulp.src(config.gulp.source.styles)
	.pipe(sourcemaps.init())
	.pipe(sass(config.gulp.build.sass).on('error', gutil.log))
	.pipe(cleanCSS(config.gulp.build.cleanCss))
	.pipe(rename(path=>{path.basename = config.gulp.build.styleRename}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(config.gulp.build.styles))
	.pipe(sftp(config.gulp.deployment.styles))
	.on('end', ()=>{
		let stylesHeader = fs.readFileSync('./src/header.txt', 'utf8');
		return gulp.src(['./style.css'])
			.pipe(header(stylesHeader))
			.pipe(gulp.dest('./'))
			.pipe(sftp(config.gulp.deployment.styles))
			.pipe(livereload())
	})
);

gulp.task('minify', ()=>gulp.src(config.gulp.source.scripts)
	//.pipe(debug())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(concat((config.gulp.build.index || 'index') + '.js'))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(config.gulp.build.scripts))
	.pipe(sftp(config.gulp.deployment.scripts))
	.on('end', ()=>gulp.src(config.gulp.source.scripts)
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(concat((config.gulp.build.index || 'index') + '.min.js'))
		.pipe(babel())
		.pipe(uglify().on('error', gutil.log))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(config.gulp.build.scripts))
		.pipe(sftp(config.gulp.deployment.scripts))
		.pipe(livereload())
	)
);

gulp.task('watch', ()=>{
	livereload.listen();
	gulp.watch(config.gulp.source.scriptsWatch, ['minify']);
	gulp.watch(config.gulp.source.stylesWatch, ['sass']);
});

gulp.task('build', ['minify', 'sass']);