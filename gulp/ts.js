'use strict';

var gulp = require('gulp');

var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var runSequence = require('run-sequence');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');

var tsProject = ts.createProject('tsconfig.json', {
  typescript: require('typescript'),
  noEmit: false,
  declaration: true
});


gulp.task('ts-test', function() {
    var stream = gulp.src(['src/at-*.ts', 'test/**/*.ts'])
  .pipe(sourcemaps.init())
  .pipe(ts(tsProject));

  return merge([
    stream.dts.pipe(gulp.dest('.tmp/')),
    stream.js.on('error', function (e) {
            throw e;
        })
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/'))
  ]);
});

gulp.task('ts-build', ['clean', 'ts-test'], function() {
   var stream = gulp.src(['src/at-*.ts'])
  .pipe(sourcemaps.init())
  .pipe(ts(tsProject));

  return merge([
    stream.dts.pipe(gulp.dest('lib')),
    stream.js.on('error', function (e) {
            throw e;
        })
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib'))
  ]);

});

gulp.task('ts-lint', function () {
    return gulp.src(['src/**/at-*.ts', 'test/**/*.ts'])
        .pipe(tslint({configuration: {rules: require('../typings/tslint.json')}}))
        .pipe(tslint.report('verbose'));
});

gulp.task('ts', function (done) {
    runSequence('ts-lint', 'ts-build', done);
});
