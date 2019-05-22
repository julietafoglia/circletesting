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
let LoginPage = require(rootPath +
    '/pages/maverick/platform/login');
let IoPage = require(rootPath +
    '/pages/maverick/campaign-manager/insertion-order-form');
let IoDetailsPage = require(rootPath +
    '/pages/maverick/campaign-manager/insertion-order-details');
let BasePage = require(rootPath +
     '/pages/maverick/index');
let basePage;
let loginPage;
let ioPage;
let ioDetailsPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer =
    targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE> {{MAVERICK}} /insertion-order {UI} @MANAGER >>> ' +
    '(+) verify ui elements - create >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        basePage = new BasePage(driver);
        ioPage = new IoPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
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

    it('io create page should have all elements', function(done) {
        basePage.navigate(targetServer, 'advertisers', targetAdvertiser.refId);
        ioDetailsPage.waitUntilLoaderNotVisible();
        ioDetailsPage.clickNewIO();
        ioPage.getInputName().then(function(element) {
            expect(element).to.exist;
        });
        ioPage.getInputNumber().then(function(element) {
            expect(element).to.exist;
        });
        ioPage.getInputBudget().then(function(element) {
            expect(element).to.exist;
        });
        ioPage.getInputStartDate().then(function(element) {
            expect(element).to.exist;
        });
        ioPage.getInputEndDate().then(function(element) {
            expect(element).to.exist;
        });
        ioPage.getButtonCreateCampaign().then(function(element) {
            expect(element).to.exist;
        });
        ioPage.getButtonSaveAndExit().then(function(element) {
            expect(element).to.exist;
        });
        ioPage.clickClose();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
