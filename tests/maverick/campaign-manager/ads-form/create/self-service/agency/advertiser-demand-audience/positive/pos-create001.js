'use strict';

// vendor dependencies
const moment = require('moment');


// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002
    .children.advertiser001
    .children.advertiserUser001;
const driverTimeOut = 0;
const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency002.children.advertiser001;
const advName = targetAdv.name;

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

// other data
// fixture(s)
const testFixture001 =
    require(rootPath + '/fixtures/common/creative/create002');
let testData001 = Object.assign({}, testFixture001);
testData001.name = testData001.name + timeStamp + ' (image)';
const testFixture002 =
    rootPath + '/fixtures/common/creative/create010.jpg';

describe('{{MAVERICK}} /ads {create} @SS-AGENCY-ADVERTISER >>> ' +
    '(+) image ad >>>', function() {

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

    it('should add image ad', function(done) {
        adLibraryPage.clickNewAd();
        adsPage.clickTitleImage();
        adsPage.setFile(testFixture002)
            .then(() => done());
    });

    it('should fill image ad data', function(done) {
        adsPage.setAdvertiser(advName);
        adsPage.setName(testData001.name);
        adsPage.setClickUrl(testData001.clickUrl);
        adsPage.setTracking1(testData001.urlTracking1);
        adsPage.getInputName().click();
        adsPage.clickSaveAndExit();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('ad should exist in ad library', function(done) {
        adLibraryPage.setInputSearchAds(testData001.name);
        adLibraryPage.getLinkText(testData001.name);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
