'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');

gulp.task('clean-tmp', function(done) {
    del(['.tmp/']).then(function () {
        done();
    });
});

gulp.task('clean-lib', function(done) {
    del(['lib/']).then(function () {
        done();
    });
});

gulp.task('clean-test', function(done) {
    del(['.test/']).then(function () {
        done();
    });
});

gulp.task('clean-bower', function (done) {
    del('bower_components').then(function () {
        done();
    });
});

gulp.task('clean', ['clean-tmp', 'clean-bower', 'clean-lib', 'clean-test']);
