'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;


// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let AdLibraryPage = require(rootPath +
    '/pages/maverick/campaign-manager/ad-library');
let loginPage;
let adLibraryPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// ads library table doesn't work on Stage
describe('<> {{MAVERICK}} /campaign-manager {UI} @MANAGER >>> ' +
    '(+) verify ad library elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        adLibraryPage = new AdLibraryPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should navigate to ad library page', function(done) {
        adLibraryPage.clickAdLibrary()
            .then(() => done());
    });

    it('ad library should contain all elements', function(done) {
        adLibraryPage.getButtonNewAd().then(function(element) {
            expect(element).to.exist;
        });
        adLibraryPage.getInputSearchAds().then(function(element) {
            expect(element).to.exist;
        });
        adLibraryPage.getTableAdName().then(function(element) {
            expect(element).to.exist;
        });
        adLibraryPage.getTableAdvName().then(function(element) {
            expect(element).to.exist;
        });
        adLibraryPage.getTableSize().then(function(element) {
            expect(element).to.exist;
        });
        adLibraryPage.getTableSource().then(function(element) {
            expect(element).to.exist;
        });
        adLibraryPage.getTableClick().then(function(element) {
            expect(element).to.exist;
        });
        adLibraryPage.getTableCreated().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
