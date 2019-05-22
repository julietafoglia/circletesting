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
testData001.name = testData001.name + timeStamp + ' (marquee)';

describe('{{MAVERICK}} /campaign-manager/ads-form {ui} @MANAGER >>> ' +
    '(+) verify ui elements - marquee ad >>>', function() {

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
        adsPage.setName(testData001.name);
        adsPage.setSourceUrl(testData001.file);
        adsPage.setClickUrl(testData001.clickUrl);
        adsPage.setAdvertiser(targetAdv.name);
        adsPage.clickInputName();
        adsPage.clickInputName();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should assert marquee checked', function(done) {
        adsPage.getInputMarquee().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
