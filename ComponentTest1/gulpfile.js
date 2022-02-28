/// <binding AfterBuild='default' Clean='clean' />
/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/
const { src, dest, parallel } = require('gulp');
var gulp = require("gulp");
var del = require("del");
var concat = require("gulp-concat");

const webpackStream = require('webpack-stream');
const webpackakBundler = require('webpack');
const webpackConfig = require('./webpack.config.js');

var paths = {
    scripts: ["scripts/**/*.js"],
};

gulp.task("clean", function () {
    return del(["wwwroot/scripts/**/*"]);
});

//gulp.task("default", function (done) {
//    gulp.src(paths.scripts)
//        .pipe(concat('app.js'))
//        .pipe(gulp.dest("wwwroot/scripts"));
//    done();
//});

// Private task used internally
function buildWebpack() {
    return webpackStream({ config: webpackConfig }, webpackakBundler)
        .pipe(dest('wwwroot/Scripts'));
}

exports.default = parallel(buildWebpack);