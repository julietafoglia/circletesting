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
let driverTimeOut = 0;

let driver; // initialized during test runtime

// selenium page object(s)
// initialized during test runtime

let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let ReportsPage = require(rootPath + '/pages/maverick/reporting/reports');
let ReportsCardPage = require(rootPath +
    '/pages/maverick/reporting/reports-card');
let loginPage, reportsCard, navBar, reportsPage;

// fixture(s)
const testFixture = require(rootPath + '/fixtures/maverick/report-template001');
let testReport = Object.assign({}, testFixture);
testReport.name = 'Test Report ' + moment().format().substring(0,19);
testReport.name = testReport.name.replace(/:/g , '_');
testReport.startDay = moment().format('MM/D/YYYY');
testReport.endDay = moment().add(2, 'days').format('MM/D/YYYY');

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;

const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE> {{MAVERICK}} /reporting {UI} @MANAGER >>> ' +
    '(+) create LiveAudience 360 Scheduled report >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('initiate selenium session', function(done) {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        reportsPage = new ReportsPage(driver);
        reportsCard = new ReportsCardPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should access reports section and open create modal', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.closeLastOuterDiv();
        navBar.closeOuterDiv();
        navBar.clickReportingTab();
        reportsPage.waitUntilSpinnerNotPresent();
        reportsPage.clickNewReport();
        reportsCard.selectCMReport();
        reportsPage.waitUntilLoaderNotVisible();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should correctly fill required fields', function(done) {
        reportsPage.setReportName(testReport.name);
        reportsPage.clickReportTypeDropdown();
        reportsPage.clickLA360ReportOption();
        reportsPage.clickSelectAdvertisersLink();
        reportsPage.clickFirstOptionListed();
        reportsPage.clickAddAdvertisersButton();
        reportsPage.clickQueryRangeDropdown();
        reportsPage.clickFirstVisibleOption();
        reportsPage.clickGranularityDropdown();
        reportsPage.clickFirstVisibleOption();
        reportsPage.clickSplitsDropDown();
        reportsPage.clickDeviceTypeOpt();
        reportsPage.clickAddScheduleLink();
        reportsPage.clickDeliveryFrequencyDropdown();
        reportsPage.clickFirstVisibleOption();
        reportsPage.setStartDate(testReport.startDay);
        reportsPage.setEndDate(testReport.endDay);
        reportsPage.clickDeliveryTimeDropdown();
        reportsPage.clickFirstVisibleOption();
        reportsPage.clickImpressionsCheckBox();
        reportsPage.waitUntilSaveButtonEnabled();
        reportsPage.clickSaveReportButton();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should search and assert report present table', function(done) {
        reportsPage.waitUntilLoaderNotVisible();
        reportsPage.searchReport(testReport.name);
        expect(reportsPage.getSpanContainsText(testReport.name)).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });
});
