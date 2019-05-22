'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

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
const targetIo = targetAdvertiser.children.insertionOrder001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath +
    '/pages/maverick/platform/login');
let IoPage = require(rootPath +
    '/pages/maverick/campaign-manager/insertion-order-form');
let IoDetailsPage = require(rootPath +
    '/pages/maverick/campaign-manager/insertion-order-details');
let AdvDetailsPage = require(rootPath +
    '/pages/maverick/campaign-manager/advertiser-details');
let BasePage = require(rootPath +
     '/pages/maverick/index');
let basePage, loginPage, ioPage, ioDetailsPage, advDetailsPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/insertion-order/create001');
let testData001 = Object.assign({}, testFixture);
testData001.name = targetIo.name + ' edit';

describe('<SMOKE> {{MAVERICK}} /insertion-order {edit} @MANAGER >>> ' +
    '(+) body - minimum required - agency >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    function formatDate(inputDate) {
        return moment(inputDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
    }

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        basePage = new BasePage(driver);
        ioPage = new IoPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        advDetailsPage = new AdvDetailsPage(driver);
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

    it('io should be edited - minimum required', function(done) {
        basePage.navigate(targetServer, 'advertisers', targetAdvertiser.refId);
        advDetailsPage.waitUntilLoaderNotVisible();
        advDetailsPage.getButtonNewIo();
        advDetailsPage.clickIo(targetIo.name);
        ioDetailsPage.clickEdit();
        ioPage.setInputName(testData001.name);
        ioPage.setInputNumber(chance.integer({min: 999999, max: 99999999}));
        ioPage.setInputBudget(testData001.budget);
        ioPage.setInputEndDate(formatDate(testData001.endDate));
        ioPage.setInputStartDate(formatDate(testData001.startDate));
        ioPage.clickInputName();
        ioPage.waitUntilSaveButtonEnabled();
        ioPage.clickSave();
        ioPage.waitUntilLoaderNotVisible();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('io should exist in adv details list', function(done) {
        ioDetailsPage.getSpan(testData001.name)
            .then(function(element) {
                expect(element).to.exist;
                done();
            });
    });

    it('io should be re-edited - minimum required', function(done) {
        ioDetailsPage.clickEdit();
        ioPage.setInputName(targetIo.name);
        ioPage.clickSave();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('io should exist in adv details list', function(done) {
        ioDetailsPage.getSpan(targetIo.name).then(function(element) {
            expect(element).to.exist;
            done();
        });
    });

});
