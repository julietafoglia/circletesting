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

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency001.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const ioStartDate = moment().format('M/DD/YYYY');
const ioEndDate = moment().add(30, 'days').format('M/DD/YYYY');

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
const targetServer =
    targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE> {{MAVERICK}} /insertion-order {UI} @MANAGER >>> ' +
    '(+) verify error messages >>>', function() {

    // disable mocha time outs
    this.timeout(0);

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

    it('should navigate to IO edit page', function(done) {
        basePage.navigate(targetServer, 'advertisers', targetAdvertiser.refId);
        advDetailsPage.waitUntilLoaderNotVisible();
        advDetailsPage.getButtonNewIo();
        advDetailsPage.clickIo(targetIo.name);
        ioDetailsPage.getLinkEdit();
        ioDetailsPage.clickEdit();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    // skipped due to jenkins failures
    xit('should display end date error message', function(done) {
        ioPage.setInputEndDate(moment().add(20, 'days')
            .format('M/D/YYYY'));
        ioPage.clickInputName();
        ioPage.clickSave();
        ioPage.getAlertError();
        ioPage.getAlertError().getAttribute('outerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .contain('The insertion order could not be saved ' +
                        'because the end date is before one of its line items');
            });
        ioPage.setInputEndDate(ioEndDate);

        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    xit('should display start date error message', function(done) {
        driver.navigate().refresh();
        ioPage.setInputStartDate(moment().add(5, 'days').format('M/D/YYYY'));
        ioPage.clickInputName();

        ioPage.clickSave();
        ioPage.getAlertError();
        ioPage.getAlertError().getAttribute('outerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .contain(' The insertion order could not be saved' +
                    ' because the start date is after one of its line items.');
            });
        ioPage.setInputStartDate(ioStartDate);
        ioPage.clickInputName();

        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    xit('should display budget Campaign error message', function(done) {
        driver.navigate().refresh();
        ioPage.setInputBudget(5000);
        ioPage.clickSave();
        ioPage.getAlertError();
        ioPage.getAlertError().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .contain('The insertion order could not be saved' +
                    ' because the budget is less than the total of' +
                        ' all campaign budgets.');
            });
        ioPage.setInputBudget(5000);
        ioPage.clickInputName();

        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    xit('should display budget LI error message', function(done) {
        driver.navigate().refresh();
        ioPage.setInputBudget(10);
        ioPage.clickSave();
        ioPage.getAlertError();
        ioPage.getAlertError().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .contain('The insertion order could not be saved' +
                    ' because the budget is less than the total of' +
                        ' all line item budgets.');
            });
        ioPage.setInputBudget(5000);
        ioPage.clickInputName();

        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
