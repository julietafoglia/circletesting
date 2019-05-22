'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');


// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
const characterPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    '0123456789?:@&=+$, ';

// selenium runtime variables
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
const testFixture =
    require(rootPath + '/fixtures/common/creative/create011');
let testData001 = Object.assign({}, testFixture);
testData001.name = testData001.name + timeStamp + ' (livesense)';

const ninetyChars = '01234567890123456789012345678901234567' +
    '89012345678901234567890123456789012345678901234567890';

describe('{{MAVERICK}} /campaign-manager/ads-form {ui} @MANAGER >>> ' +
    '(+) verify ui elements - native ad >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('maverick - login', function(done) {
        loginPage = new LoginPage(driver);
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should navigate to ad library', function(done) {
        adLibraryPage = new AdLibraryPage(driver);
        adLibraryPage.clickAdLibrary()
            .then(() => done());
    });

    it('native ad should contain all elements', function(done) {
        adsPage = new AdsPage(driver);
        adLibraryPage.clickNewAd();
        adsPage.clickTitleNative();
        adsPage.getInputAdvertiser();
        adsPage.getInputNativeName();
        adsPage.getInputAdvName();
        adsPage.getInputProductName();
        adsPage.getInputHeadline();
        adsPage.getInputClickUrl();
        adsPage.getInputImageUrl();
        adsPage.getInputCallToAction();
        adsPage.getButtonRating();
        adsPage.getInputPrice();
        adsPage.getInputSalePrice();
        adsPage.getButtonCurrency();
        adsPage.getInputThirdPartyTracker();
        adsPage.getLinkSecondTrack();
        adsPage.getCheckTextAd();
        adsPage.getPreviewTextAd();
        adsPage.getCheckInFeedAd();
        adsPage.getPreviewInFeedAd();
        adsPage.getCheckPromotedListing();
        adsPage.getPreviewPromotedListing();
        driver.sleep(1).then(() => done());
    });

    it('should check error messages', function(done) {
        adsPage.setNativeName('');
        adsPage.getTextErrorRequired();
        adsPage.setNativeName('test name');

        adsPage.setAdvName('');
        adsPage.getTextErrorRequired();
        adsPage.setAdvName(characterPool);
        adsPage.getTextErrorChars();
        adsPage.setAdvName('test adv name');

        adsPage.setProductName('');
        adsPage.getTextErrorRequired();
        adsPage.setProductName(characterPool);
        adsPage.getTextErrorChars();
        adsPage.setProductName('test prod name');

        adsPage.setHeadline('');
        adsPage.getTextErrorRequired();
        adsPage.setHeadline(ninetyChars);
        adsPage.getTextErrorChars();
        adsPage.setHeadline('test headline');

        adsPage.setClickUrl('');
        adsPage.getTextErrorRequired();
        adsPage.setClickUrl(testData001.clickUrl);

        adsPage.setImageUrl('');
        adsPage.getTextErrorRequired();
        adsPage.setImageUrl(testData001.file);

        driver.sleep(1).then(() => done());
    });

    it('should check disabled fields', function(done) {
        adsPage.clickCheckPromotedListing();
        adsPage.getInputProductName().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to
                    .contain('disabled');
            });
        adsPage.getInputPrice().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to
                    .contain('disabled');
            });
        adsPage.getInputSalePrice().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to
                    .contain('disabled');
            });
        adsPage.getButtonRating().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to
                    .contain('disabled');
            });
        adsPage.getButtonCurrency().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to
                    .contain('disabled');
            });

        adsPage.clickCheckInFeedAd();
        adsPage.getInputImageUrl().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to
                    .contain('disabled');
            });

        adsPage.clickCheckTextAd();
        adsPage.getInputAdvName().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to
                    .contain('disabled');
            });
        adsPage.getInputHeadline().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to
                    .contain('disabled');
            });
        adsPage.getInputClickUrl().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to
                    .contain('disabled');
            });
        adsPage.getInputCallToAction().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to
                    .contain('disabled');
            });

        driver.sleep(1).then(() => done());
    });

});
