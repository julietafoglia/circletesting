'use strict';

// vendor dependencies
const gulp = require('gulp-help')(require('gulp'));
const gulpSequence = require('gulp-sequence');
const Plugins = require('gulp-load-plugins')({
    DEBUG: false, // log info to console
    camelize: true, // transforms hyphenated plugins names to camel case
    lazy: true // whether plugins should be lazy loaded on demand
});

const argv = require('yargs').argv;
const jsonfile = require('jsonfile');
const prettyjson = require('prettyjson');

// grep patterns0
const DEBUG_PATTERN = '(<DEBUG>)';
const MAVERICK_SMOKE_PATTERN = '(<SMOKE>)';
const MAVERICK_PROD_SMOKE_PATTERN = '(<SMOKE-PROD>)';
const MERLIN_SMOKE_PATTERN = '(<SMOKE>)';
const SMOKE_PATTERN = '\\(\\+\\)';

// set src paths
const paths = {
    all: ['*.js', '**/*.js', '!**/ignore.*', '!node_modules/**'],
    bootstrap: ['bootstrap/**/*.js', '!bootstrap/teardown-*.js'],
    bootstrapDSP: ['bootstrap/demand/**/*.js'],
    bootstrapSSP: ['bootstrap/inventory/**/*.js'],
    maverick: ['tests/maverick/**/*.js',
        '!tests/maverick/**/ignore.*',
        '!tests/maverick/inventory-manager/**/*.js',
        '!tests/maverick/campaign-manager/reporting/**/*.js',
        '!tests/maverick/campaign-manager/audience-form/**/*.js'],
    merlin: ['tests/merlin/**/*.js', 'tests/merlin/search/**/*.js',
        '!tests/merlin/**/ignore.*', '!tests/merlin/**/search/ignore.*'
    ],
    salesforce: ['tests/salesforce/**/*.js', '!tests/salesforce/**/ignore.*'],
    reporting: ['tests/reporting/**/*.js', '!tests/reporting/**/ignore.*'],
    maverickui: ['tests/maverick/**/ui*.js',
        '!tests/maverick/**/ignore.*'],
    exclude: '!**/ignore.*'
};

// All available options
const options = {
    options: {
        'env':        '   Set test environment.',
        'browser':    '   Set selenium browser.',
        'glob':       '   Set subset via glob pattern.',
        'grep':       '   Set subset via grep pattern.',
        'iceman':     '   Set iceman local environment server.',
        'screenshot': '   Enable screenshots on failure',
        'token':      '   Set iceman local environment client token.'
    }
};

/**
 * Check and setup environment variables
 * @param {String} product e.g merlin, maverick, reporting, etc
 * @returns {Boolean} true if env variables set correctly false otherwise
 */
function envSetup(product) {
    process.env.ROOT_PATH = __dirname;
    process.env.NODE_ENV = argv.env || 'qa';
    if (product === 'maverick' || product === 'maverickui') {
        process.env.PRODUCT = 'maverick';
        process.env.SCREENSHOT = argv.screenshot || 'off';
        process.env.SELENIUM_BROWSER = argv.browser || 'chrome';
        process.env.SELENIUM_HEADLESS = argv.headless || false;
        if (argv.env === 'local' &&
            !(process.env.MERLIN_SERVER &&
            process.env.MAVERICK_SERVER)) {
            process.stderr.write(
                '\nRequired env variable(s) MERLIN_SERVER ' +
                'or MAVERICK_SERVER not set\n'
            );
            return false;
        }
    } else if (product === 'merlin') {
        if (argv.env === 'local' && !process.env.MERLIN_SERVER) {
            process.stderr.write(
                '\nRequired env variable MERLIN_SERVER not set\n'
            );
            return false;
        }
    } else if (product === 'salesforce') {
        process.env.PRODUCT = 'salesforce';
        process.env.SCREENSHOT = argv.screenshot || 'off';
        process.env.SELENIUM_BROWSER = argv.browser || 'chrome';
    } else if (product === 'reporting') {
        // set iceman local server
        process.env.ICEMAN_SERVER = argv.iceman;
        // set iceman local token
        process.env.ICEMAN_TOKEN = argv.token;
        if (argv.env === 'local' && !process.env.REPORTING_SERVER) {
            process.stderr.write(
                '\nRequired env variable REPORTING_SERVER is not set\n'
            );
            return false;
        }
    }
    return true;
}

/**
 * Setup for gulp tasks
 * @param {String} product e.g merlin, maverick, reporting, etc
 * @param {String} subset test subset - all, debug, subset, smoke
 * @param {String} grepPattern grep pattern
 */
function gulpTaskSetup(product, subset, grepPattern = '') {
    if (!envSetup(product)) { return; }
    let testsPath = argv.glob ? [argv.glob, paths.exclude] : paths[product];

    let reporterOptions = {
        'json': {
            'stdout': `./results/${product}/report-${subset}.json`
        },
        'mocha-circleci-reporter': {
            'stdout': `./tmp/${product}/report-${subset}.stdout`,
            'options': {
                'junit_report_name': `${product} ${subset} test report`,
                'junit_report_path':
                    `./results/${product}/report-${subset}.xml`,
                'junit_report_stack': 1,
                'junit_report_packages': 1
            }
        },
        'spec': '-'
    };
    return gulp.src(testsPath, {read: false})
        .pipe(Plugins.mocha({
            'grep': grepPattern,
            'reporter': 'mocha-multi',
            'reporterOptions': reporterOptions
        }));
}




// eslint - all
gulp.task('lint-all', function() {
    gulp.src(paths.all)
        .pipe(Plugins.eslint())
        .pipe(Plugins.eslint.format())
    });

// eslint - subset
gulp.task('lint-subset', function() {
    // default to all paths if glob pattern does not exist
    let globPattern = argv.glob || paths.all;
    return gulp.src(globPattern)
        .pipe(Plugins.eslint())
        .pipe(Plugins.eslint.format());
}, options);

// eslint - watch
gulp.task('lint-watch', function() {
    // Lint only files that change after this watch starts
    const lintAndPrint = Plugins.eslint();
    // format results with each file, since this stream will not end
    lintAndPrint.pipe(Plugins.eslint.formatEach());

    return gulp.watch(paths.all, (event) => {
        if (event.type !== 'deleted'){
            gulp.src(event.path)
                .pipe(lintAndPrint, {end: false});
        }
    });
});

// bootstrap - setup
gulp.task('setup', function(done) {
    process.env.ROOT_PATH = __dirname;
    envSetup();
    let bootstrapPaths,
        filenameDSP = './bootstrap/entities-dsp',
        filenameSSP = './bootstrap/entities-dsp';
    if (!argv.group) {
        bootstrapPaths = paths.bootstrap;
        jsonfile.writeFileSync(`${filenameDSP}.json`, {});
        jsonfile.writeFileSync(`${filenameSSP}.json`, {});
    } else if (argv.group === 'dsp') {
        bootstrapPaths = paths.bootstrapDSP;
        jsonfile.writeFileSync(`${filenameDSP}.json`, {});
    } else {
        bootstrapPaths = paths.bootstrapSSP;
        jsonfile.writeFileSync(`${filenameSSP}.json`, {});
    }

    return gulp.src(bootstrapPaths, {read: false})
        .pipe(Plugins.mocha({
            'reporter': 'mocha-circleci-reporter',
            'reporterOptions': {
                'junit_report_name': 'Bootstrap Setup Report',
                'junit_report_path': './results/bootstrap/report-setup.xml',
                'junit_report_stack': 1,
                'junit_report_packages': 1
            }
        }));
    
    done();
}, options);

// bootstrap - teardown
gulp.task('teardown', function() {
    // add root_dir to simplify path lookups
    process.env.ROOT_PATH = __dirname;
    // set environment
    envSetup();
    let group = argv.group;

    try {
        if (!group) {
            require('./bootstrap/entities-dsp.json');
            require('./bootstrap/entities-ssp.json');
        } else if (group === 'dsp') {
            require('./bootstrap/entities-dsp.json');
        } else {
            require('./bootstrap/entities-ssp.json');
        }
    } catch (err) {
        process.stdout.write(
            `\nNo entities to teardown. "./bootstrap/entities-${group ?
                group : '[dsp/ssp]'}.json" does not exist\n`
        );
        return;
    }

    let teardownPaths;
    if (!group) {
        teardownPaths = ['bootstrap/teardown-*.js'];
    } else if (group === 'dsp') {
        teardownPaths = ['bootstrap/teardown-dsp.js'];
    } else {
        teardownPaths = ['bootstrap/teardown-ssp.js'];
    }
    return gulp.src(teardownPaths, {read: false})
        .pipe(Plugins.mocha({
            'reporter': 'mocha-circleci-reporter',
            'reporterOptions': {
                'junit_report_name': 'Bootstrap Teardown Report',
                'junit_report_path': './results/bootstrap/report-teardown.xml',
                'junit_report_stack': 1,
                'junit_report_packages': 1
            }
        }));
}, options);

// bootstrap - view
gulp.task('view', function(done) {
    let entitiesObj;
    try {
        entitiesObj = require('./bootstrap/entities-dsp.json');
    } catch (err) {
        process.stdout.write(
            '\nNo entities file found. ' +
            'Please run "gulp bootstrap-setup" first\n'
        );
        return;
    }
    const options = {
        keysColor: 'cyan',
        stringColor: 'white',
        dashColor: 'white',
        boolColor: 'white',
        numberColor: 'magenta'
    };
    process.stdout.write(prettyjson.render(entitiesObj, options));
    done();
});

// bootstrap - debug
gulp.task('bootstrap-debug', function() {
    gulpTaskSetup('bootstrap', 'debug', DEBUG_PATTERN);
}, options);


/* Maverick Tasks */
gulp.task('mav-all', function() {
    () => gulpTaskSetup('maverick', 'all')}, options);

gulp.task('maverick-debug', function() {
    gulpTaskSetup('maverick', 'debug', DEBUG_PATTERN);
}, options);

gulp.task('mav-smoke', function(done) {
    gulpTaskSetup('maverick', 'smoke', MAVERICK_SMOKE_PATTERN);
    done();
}, options);

gulp.task('mav-prod', function() {
    gulpTaskSetup('maverickui', 'prod', MAVERICK_PROD_SMOKE_PATTERN);
}, options);

gulp.task('maverick-subset', function(done) {
        gulpTaskSetup('maverick', 'subset', argv.grep || '');
        done();
    }, options);

gulp.task('maverick-all', gulp.series('setup', 'mav-all', 'teardown'));

gulp.task('maverick-smoke', gulp.series('setup', 'mav-smoke'));


/* Merlin Tasks */
gulp.task('merlin-all', function() {
    gulpTaskSetup('merlin', 'all');
}, options);

gulp.task('merlin-debug', function() {
    gulpTaskSetup('merlin', 'debug', DEBUG_PATTERN);
}, options);

gulp.task('merlin-smoke', function() {
    gulpTaskSetup('merlin', 'smoke', MERLIN_SMOKE_PATTERN);
}, options);

gulp.task('merlin-subset', gulp.series('lint-subset', function() {
        gulpTaskSetup('merlin', 'subset', argv.grep || '');
    }), options);

/* Reporting Tasks */
gulp.task('reporting-all', function() {
    gulpTaskSetup('reporting', 'all');
}, options);

gulp.task('reporting-debug', function() {
    gulpTaskSetup('reporting', 'debug', DEBUG_PATTERN);
}, options);

gulp.task('reporting-smoke', function() {
    gulpTaskSetup('reporting', 'smoke', SMOKE_PATTERN);
}, options);

gulp.task('reporting-subset', gulp.series('lint-subset', function() {
        gulpTaskSetup('reporting', 'subset', argv.grep || '');
    }), options);


/* Salesforce Tasks */
gulp.task('sf-all', function() {
    gulpTaskSetup('salesforce', 'all');
}, options);

gulp.task('sf-debug', function() {
    gulpTaskSetup('salesforce', 'debug', DEBUG_PATTERN);
}, options);

gulp.task('sf-smoke', function() {
    gulpTaskSetup('salesforce', 'smoke', SMOKE_PATTERN);
}, options);

gulp.task('sf-subset', function() {
        gulpTaskSetup('salesforce', 'subset', argv.grep || '');
}, options);