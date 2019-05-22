'use strict';
// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002.children.agencyUser001;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency002.children.advertiser001;
const targetCreative = targetAdv.children.creative001;

// selenium runtime variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let AdsPage = require(rootPath + '/pages/maverick/campaign-manager/ads-form');
let AdLibraryPage = require(rootPath +
    '/pages/maverick/campaign-manager/ad-library');
let loginPage;
let adsPage;
let adLibraryPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');
const editedAdName = '000 edited ad';

describe('{{MAVERICK}} /ads {edit} @SS-AGENCY >>> ' +
    '(+) edit image ad >>>', function() {

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
        adLibraryPage.clickAdLibrary();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should navigate to edit ad page', function(done) {
        adLibraryPage.setInputSearchAds(targetCreative.refId);
        adLibraryPage.clickEditAd(targetCreative.name);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should edit ad', function(done) {
        expect(adsPage.getDivText(targetAdv.name)).to.exist;
        adsPage.setName(editedAdName);
        adsPage.getInputName().click();
        adsPage.clickSaveAndExit();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('ad should exist in ad library', function(done) {
        adLibraryPage.waitUntilLoaderNotVisible();
        adLibraryPage.getAdTitle(editedAdName);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should navigate to edit ad page', function(done) {
        expect(adLibraryPage.getLinkText(targetAdv.name)).to.exist;
        adLibraryPage.clickEditLink(editedAdName);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should re edit ad', function(done) {
        adsPage.setName(targetCreative.name);
        adsPage.clickSaveAndExit();
        expect(adLibraryPage.getAdTitle(targetCreative.name)).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
