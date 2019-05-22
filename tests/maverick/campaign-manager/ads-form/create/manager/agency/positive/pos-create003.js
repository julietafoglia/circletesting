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
const driverTimeOut = 0;
const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency001.children.advertiser001;

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

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/creative/create011');
let testData001 = Object.assign({}, testFixture);
testData001.name = testData001.name + timeStamp + ' (marquee)';


describe('{{MAVERICK}} /ads {create} @MANAGER >>> ' +
    '(+) marquee ad >>>', function() {

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
        adLibraryPage.clickAdLibrary()
            .then(() => done());
    });

    it('should navigate to third party ad', function(done) {
        adLibraryPage.clickNewAd();
        adsPage.clickTitleThirdParty();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should create 970x550 third party ad', function(done) {
        adsPage.setAdvertiser(targetAdv.name);
        adsPage.setSourceUrl(testData001.file);
        adsPage.setName(testData001.name);
        adsPage.setClickUrl(testData001.clickUrl);
        adsPage.clickInputName();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should save 970x550 third party ad', function(done) {
        adsPage.clickSaveAndExit();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('ad should exist in ad library', function(done) {
        adLibraryPage.clickSelectedAccounts();
        adLibraryPage.clickAllAccounts();
        adLibraryPage.setInputSearchAds(testData001.name);
        adLibraryPage.getLinkText(testData001.name);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should navigate to created ad', function(done) {
        adLibraryPage.clickEditAd(testData001.name);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should assert marquee checked after editing', function(done) {
        adsPage.getInputMarquee().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
