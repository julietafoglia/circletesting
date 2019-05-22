'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002
    .children.advertiser001
    .children.advertiserUser001;
const driverTimeOut = 0;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let ReportsPage = require(rootPath + '/pages/maverick/reporting/reports');
let ReportsCardPage = require(rootPath +
    '/pages/maverick/reporting/reports-card');
let loginPage, reportsCard, navBar, reportsPage;

// Reports texts:
const SCH_QUERY_RANGE = ['Week to Date', 'Month to Date', 'Quarter to Date',
    'Year to Date', 'Yesterday', 'Past 7 Days', 'Past 30 Days',
    'Past 90 Days', 'Last Month'];
const ADHOC_QUERY_RANGE = SCH_QUERY_RANGE.concat('Date Range');
const TIME_GRANULARITY = ['Day', 'Week', 'Month', 'All'];

const SPLITS = ['Demand Type', 'Advertiser ID', 'Advertiser Name',
    'Campaign ID', 'Campaign Name', 'Line Item ID', 'Line Item Name',
    'Creative ID', 'Creative Name', 'Creative Size', 'Publisher ID'];

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;

const driverBuilder = require(rootPath + '/helpers/driver-builder');

function buttonsDisabled() {
    reportsPage.getRightButton().getAttribute('disabled')
        .then(function(attr) {
            expect(attr).to.exist;
        });
}

function assertDisplayedOptions(array) {
    reportsPage.checkArray(reportsPage.getDisplayedOptions())
        .then((arr) => {
            expect(arr).to.eql(array);
        }).catch((err) => {
            throw err;
        });
    reportsPage.dismissAction();
}

describe('{{MAVERICK}} campaign-manager/reporting {ui} @Self-service' +
    ' user >>> (+) external user visible options checks >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        reportsPage = new ReportsPage(driver);
        navBar = new NavBar(driver);
        reportsCard = new ReportsCardPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should login to maverick', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should get to reports page to maverick', function(done) {
        navBar.clickReportingTab();
        reportsPage.waitUntilSpinnerNotPresent();
        reportsPage.clickNewReport();
        reportsCard.selectCMReport();
        reportsPage.waitUntilLoaderNotVisible();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check save changes button is in correct state', function(done) {
        buttonsDisabled();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert report modal elements', function(done) {
        expect(reportsPage.getReportNameField()).to.exist;
        expect(reportsPage.getAllAdvertisersLink()).to.exist;
        expect(reportsPage.getSplitsDropdown()).to.exist;
        reportsPage.clickSplitsDropdown();
        assertDisplayedOptions(SPLITS);
        expect(reportsPage.getQueryRangeDropdown()).to.exist;
        reportsPage.clickQueryRangeDropdown();
        assertDisplayedOptions(ADHOC_QUERY_RANGE);
        expect(reportsPage.getGranularityDropdown()).to.exist;
        reportsPage.clickGranularityDropdown();
        assertDisplayedOptions(TIME_GRANULARITY);
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check DSPfee is not present', function(done) {
        reportsPage.checkDSPFeeItsNotPresent()
            .then((val) => { expect(val.length).to.equal(0); });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
