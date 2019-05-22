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
let AdsPage = require(rootPath + '/pages/maverick/campaign-manager/ads-form');
let AdLibraryPage = require(rootPath + '/pages/maverick/campaign-manager' +
    '/ad-library');
let loginPage;
let adsPage;
let adLibraryPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixture(s)
const testFixture002 =
    rootPath + '/fixtures/common/creative/create010.jpg';

describe('<SMOKE-PROD> {{MAVERICK}} /campaign-manager/ads-form {ui} @MANAGER ' +
    '>>> (+) verify ui elements - image ad >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        adLibraryPage = new AdLibraryPage(driver);
        adsPage = new AdsPage(driver);
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

    it('should navigate to ad library', function(done) {
        adLibraryPage.closeOuterDiv();
        adLibraryPage.clickAdLibrary()
            .then(() => done());
        adLibraryPage.closeOuterDiv();
    });

    it('should check image ad elements', function(done) {
        adLibraryPage.closeOuterDiv();
        adLibraryPage.clickNewAd();
        adsPage.clickTitleImage();
        adsPage.getInputAdvertiser();
        adsPage.getInputFile().then(function(element) {
            expect(element).to.exist;
        });
        adsPage.setFile(testFixture002);
        adsPage.getInputName().then(function(element) {
            expect(element).to.exist;
        });
        adsPage.getInputClickUrl().then(function(element) {
            expect(element).to.exist;
        });
        adsPage.getInputTracking1().then(function(element) {
            expect(element).to.exist;
        });
        adsPage.getLinkSecondTrack().then(function(element) {
            expect(element).to.exist;
        });
        adsPage.getButtonUploadAd().then(function(element) {
            expect(element).to.exist;
        });
        adsPage.getCarousel().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
