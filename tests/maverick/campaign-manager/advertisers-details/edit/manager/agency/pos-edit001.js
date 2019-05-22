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

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency001.children.advertiser001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let basePage;
let loginPage;
let advertiserPage;
let advDetsPage;
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let BasePage = require(rootPath + '/pages/maverick/index');
let AdvertiserPage = require(rootPath +
     '/pages/maverick/campaign-manager/advertiser-form');
let AdvDetsPage = require(rootPath +
     '/pages/maverick/campaign-manager/advertiser-details');

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/advertiser/create001');
let testData001 = Object.assign({}, testFixture);
testData001.name = targetAdvertiser.name + ' EDITED';


describe('{{MAVERICK}} /advertisers {edit} @MANAGER >>> ' +
    '(+) edit media group advertiser - minimum required >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        basePage = new BasePage(driver);
        advertiserPage = new AdvertiserPage(driver);
        advDetsPage = new AdvDetsPage(driver);
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

    it('should navigate to advertiser details page', function(done) {
        basePage.navigate(targetServer, 'advertisers', targetAdvertiser.refId);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should edit advertiser', function(done) {
        advDetsPage.clickEditAdv();
        advertiserPage.setName(testData001.name);
        advertiserPage.setPrimaryDomain(testData001.domain);
        advertiserPage.setExecutive('QA-All User');
        advertiserPage.getLinkLabel().click();
        advertiserPage.setLabel(testData001.name);
        advertiserPage.clickSaveAndExit();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });


    it('advertiser should be edited in adv details list', function(done) {
        advDetsPage.getAdvTitle(testData001.name)
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should re edit advertiser', function(done) {
        advDetsPage.clickEditAdv();
        advertiserPage.setName(targetAdvertiser.name);
        advertiserPage.closeInputLabel().click();
        advertiserPage.clickSaveAndExit();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('advertiser should be re edited in adv details list', function(done) {
        advDetsPage.getAdvTitle(targetAdvertiser.name)
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
