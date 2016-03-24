module.exports = function (config) {
    config.set({
        basePath: '',
        files: [
            '../node_modules/angular/angular.js',
            '../.tmp/at-angular.js',
            '../node_modules/angular-resource/angular-resource.js',
            '../.tmp/at-angular-resource.js',
            '../node_modules/angular-mocks/angular-mocks.js',
            '../.tmp/module.js',
            '../.tmp/component.js'
        ],
        exclude: [],
        reporters: ['dots', 'coverage'],
        port: 9876,
        runnerPort: 9100,
        colors: true,
        logLevel: config.LOG_WARN,
        autoWatch: true,
        browsers: ['PhantomJS'],
        plugins: [
            'karma-jasmine',
            'karma-coffee-preprocessor',
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher'
        ],
        preprocessors: {
            '../.tmp/at-*.js': ['coverage'],
            '../test/*.coffee': ['coffee']
        },
        captureTimeout: 60000,
        singleRun: false,
        frameworks: ['jasmine']
    });
};
