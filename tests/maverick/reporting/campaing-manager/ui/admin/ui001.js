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

// selenium runtime variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let ReportsPage = require(rootPath + '/pages/maverick/reporting/reports');
let ReportsCardPage = require(rootPath +
    '/pages/maverick/reporting/reports-card');
let loginPage, reportsCard, navBar, reportsPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;

const driverBuilder = require(rootPath + '/helpers/driver-builder');

const warningMessage = 'Note: The numbers in this report will be estimated' +
    ' values based on sampled data.';
const otherWarningMessage = 'Note: Filtering by Device Type, Browser, OS, ' +
    'Age, Gender and Metro/Country/Region will cause numbers in this report' +
    ' to use estimated values based on sampled data.';

describe('<SMOKE-PROD> {{MAVERICK}} /reports {ui} @ADMIN >>> (+)' +
    ' CM table and create modal validation >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        reportsPage = new ReportsPage(driver);
        reportsCard = new ReportsCardPage(driver);
        driver.manage().deleteAllCookies().then( () => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should login to maverick', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should go to reports landing page', function(done) {
        navBar.clickReportingTab();
        reportsPage.waitUntilSpinnerNotPresent();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert reports page elements', function(done) {
        expect(reportsPage.getReportsHeader()).to.exist;
        expect(reportsPage.getMyReportsTab()).to.exist;
        expect(reportsPage.getAllReportsTab()).to.exist;
        expect(reportsPage.getCreateButton()).to.exist;
        expect(reportsPage.getMyReportsTab()).to.exist;
        expect(reportsPage.getAllReportsTab()).to.exist;
        reportsPage.clickAllReportsTab();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should open report create modal', function(done) {
        reportsPage.clickNewReport();
        reportsCard.selectCMReport();
        reportsPage.waitUntilLoaderNotVisible();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should validate custom report fields', function(done) {
        expect(reportsPage.getQueryRangeDropdown()).to.exist;
        reportsPage.clickQueryRangeDropdown();
        expect(reportsPage.getWeekToDateOption()).to.exist;
        expect(reportsPage.getMonthToDateOption()).to.exist;
        expect(reportsPage.getQarterToDateOption()).to.exist;
        expect(reportsPage.getYearToDateOption()).to.exist;
        expect(reportsPage.getYesterdayOption()).to.exist;
        expect(reportsPage.getPast7DaysOption()).to.exist;
        expect(reportsPage.getPast30DaysOption()).to.exist;
        expect(reportsPage.getPast90DaysOption()).to.exist;
        expect(reportsPage.getLastMonthOption()).to.exist;
        expect(reportsPage.getDateRangeOption()).to.exist;
        reportsPage.clickDateRangeOption();
        expect(reportsPage.getStartDateInput()).to.exist;
        expect(reportsPage.getEndDateInput()).to.exist;
        expect(reportsPage.getGranularityText()).to.exist;
        expect(reportsPage.getGranularityDropdown()).to.exist;
        reportsPage.clickGranularityDropdown();
        expect(reportsPage.getDayOption()).to.exist;
        expect(reportsPage.getAllOption()).to.exist;
        reportsPage.clickGranularityDropdown();
        expect(reportsPage.getSplitsDropDown()).to.exist;
        reportsPage.clickSplitsDropDown();
        expect(reportsPage.getDemandTypeOpt()).to.exist;
        expect(reportsPage.getAdvertiserIdOpt()).to.exist;
        expect(reportsPage.getAdvertiserNameOpt()).to.exist;
        expect(reportsPage.getCampaignIdOpt()).to.exist;
        expect(reportsPage.getCampaignNameOpt()).to.exist;
        expect(reportsPage.getLineItemIdOpt()).to.exist;
        expect(reportsPage.getLineItemNameOpt()).to.exist;
        expect(reportsPage.getCreativeIdOpt()).to.exist;
        expect(reportsPage.getCreativeNameOpt()).to.exist;
        expect(reportsPage.getCreativeSizeOpt()).to.exist;
        expect(reportsPage.getPublisherIdOpt()).to.exist;
        expect(reportsPage.getPublisherDomainOpt()).to.exist;
        expect(reportsPage.getPublisherNameOpt()).to.exist;
        reportsPage.clickSplitsDropDown();
        expect(reportsPage.getAddInexactSplitsLink()).to.exist;
        reportsPage.clickAddInexactSplitsLink();
        expect(reportsPage.getAddInexactSplitsButton()).to.exist;
        reportsPage.clickInexactSplitsButton();
        expect(reportsPage.getAgeOpt()).to.exist;
        expect(reportsPage.getGenderOpt()).to.exist;
        expect(reportsPage.getDeviceTypeOpt()).to.exist;
        expect(reportsPage.getCountryOpt()).to.exist;
        expect(reportsPage.getRegionOpt()).to.exist;
        expect(reportsPage.getMetroOpt()).to.exist;
        expect(reportsPage.getOSOpt()).to.exist;
        expect(reportsPage.getBrowserOpt()).to.exist;
        reportsPage.clickAgeOpt();
        reportsPage.clickGenderOpt();
        reportsPage.getWarningMessage().getText()
            .then(function(text) {
                expect(text).to.be.equal(warningMessage);
            });
        reportsPage.clickCloseInexactSplitsButton();

        expect(reportsPage.getAddAFilterLink()).to.exist;
        reportsPage.clickAddAFilterLink();
        expect(reportsPage.getAddOtherFilterButton()).to.exist;
        reportsPage.clickAddOtherFilterButton();
        expect(reportsPage.getCreativeSizeOpt()).to.exist;
        expect(reportsPage.getDeviceTypeOpt()).to.exist;
        expect(reportsPage.getBrowserOpt()).to.exist;
        expect(reportsPage.getOSOpt()).to.exist;
        expect(reportsPage.getAgeOpt()).to.exist;
        expect(reportsPage.getGenderOpt()).to.exist;
        expect(reportsPage.getMetroCountryRegionOpt()).to.exist;
        reportsPage.clickCreativeSizeOpt();
        reportsPage.clickDeviceTypeOpt();
        reportsPage.clickBrowserOpt();
        reportsPage.clickOSOpt();
        reportsPage.clickAgeOpt();
        reportsPage.clickGenderOpt();
        reportsPage.clickMetroCountryRegionOpt();
        reportsPage.getWarningMessage().getText()
            .then(function(text) {
                expect(text).to.be.equal(otherWarningMessage);
            });

        expect(reportsPage.getClearSelectionLink()).to.exist;
        expect(reportsPage.getSelectAllLink()).to.exist;
        expect(reportsPage.getImpressionsCheckBox()).to.exist;
        expect(reportsPage.getDSPFeeCheckBox()).to.exist;
        expect(reportsPage.getClicksCheckBox()).to.exist;
        expect(reportsPage.getConversionsCheckBox()).to.exist;
        expect(reportsPage.getAdvertiserSpendCheckBox()).to.exist;
        expect(reportsPage.getPostViewConvCheckBox()).to.exist;
        expect(reportsPage.getGrossECPMCheckBox()).to.exist;
        expect(reportsPage.getCTRCheckBox()).to.exist;
        expect(reportsPage.getCCRCheckBox()).to.exist;
        expect(reportsPage.getECPACheckBox()).to.exist;
        expect(reportsPage.getECPCCheckBox()).to.exist;

        reportsPage.clickReportTypeDropdown();
        reportsPage.clickCustomOption();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert create modal form', function(done) {
        expect(reportsPage.getCreateHeaderTitle()).to.exist;
        expect(reportsPage.getReportExitButton()).to.exist;
        expect(reportsPage.getSaveReporButton()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert create modal links', function(done) {
        expect(reportsPage.getAdvertiserText()).to.exist;
        expect(reportsPage.getAllMyAdvertisersLink()).to.exist;
        expect(reportsPage.getSelectAdvertisersLink()).to.exist;
        expect(reportsPage.getAddScheduleLink()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should verify publishers selections are added', function(done) {
        reportsPage.clickSelectAdvertisersLink();
        expect(reportsPage.getChooseAdvertiserHeader()).to.exist;
        expect(reportsPage.getExitChooseAdvertiser()).to.exist;
        expect(reportsPage.getCancelChooseAdvertiser()).to.exist;
        expect(reportsPage.getAddAdvertisersButton()).to.exist;
        expect(reportsPage.getFirstOptionListed()).to.exist;
        reportsPage.clickFirstOptionListed();
        expect(reportsPage.getClearAllLinkAdv()).to.exist;
        reportsPage.clickAddAdvertisersButton();
        expect(reportsPage.getSelectedAdvertisersText()).to.exist;
        expect(reportsPage.getClearAllLinkAdv()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert schedule report options', function(done) {
        reportsPage.clickAddScheduleLink();
        expect(reportsPage.getCloseScheduleButton()).to.exist;
        reportsPage.clickCloseScheduleButton();
        reportsPage.clickAddScheduleLink();
        expect(reportsPage.getDeliveryFrequencyDropdown()).to.exist;
        expect(reportsPage.getStartDeliveryDurationInput()).to.exist;
        expect(reportsPage.getEndDeliveryDurationInput()).to.exist;
        expect(reportsPage.getDeliveryTimeDropdown()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should select liveaudience 360 report option', function(done) {
        expect(reportsPage.getReportTypeText()).to.exist;
        expect(reportsPage.getRerportTypeDropdown()).to.exist;
        reportsPage.clickReportTypeDropdown();
        expect(reportsPage.getLA360ReportOption()).to.exist;
        reportsPage.clickLA360ReportOption();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should validate liveaudience 360 report fields', function(done) {
        expect(reportsPage.getSelectAdvertisersLink()).to.exist;
        expect(reportsPage.getCampaignType()).to.exist;
        expect(reportsPage.getDSPCampaignType()).to.exist;
        expect(reportsPage.getGranularityDropdown()).to.exist;
        reportsPage.clickGranularityDropdown();
        expect(reportsPage.getDayOption()).to.exist;
        expect(reportsPage.getAllOption()).to.exist;
        reportsPage.clickGranularityDropdown();
        expect(reportsPage.getQueryRangeDropdown()).to.exist;
        reportsPage.clickQueryRangeDropdown();
        expect(reportsPage.getWeekToDateOption()).to.exist;
        expect(reportsPage.getMonthToDateOption()).to.exist;
        expect(reportsPage.getQarterToDateOption()).to.exist;
        expect(reportsPage.getYearToDateOption()).to.exist;
        expect(reportsPage.getYesterdayOption()).to.exist;
        expect(reportsPage.getPast7DaysOption()).to.exist;
        expect(reportsPage.getPast30DaysOption()).to.exist;
        expect(reportsPage.getPast90DaysOption()).to.exist;
        expect(reportsPage.getLastMonthOption()).to.exist;
        expect(reportsPage.getDateRangeOption()).to.exist;
        reportsPage.clickDateRangeOption();
        expect(reportsPage.getStartDateInput()).to.exist;
        expect(reportsPage.getEndDateInput()).to.exist;
        expect(reportsPage.getGranularityText()).to.exist;
        expect(reportsPage.getSplitsDropDown()).to.exist;
        reportsPage.clickSplitsDropDown();
        expect(reportsPage.getCampaignIdOpt()).to.exist;
        expect(reportsPage.getLineItemIdOpt()).to.exist;
        expect(reportsPage.getCreativeIdOpt()).to.exist;
        expect(reportsPage.getDeviceTypeOpt()).to.exist;
        expect(reportsPage.getOSOpt()).to.exist;
        expect(reportsPage.getOrderIdOpt()).to.exist;
        expect(reportsPage.getUPAOpt()).to.exist;
        reportsPage.clickSplitsDropDown();
        expect(reportsPage.getSelectAllLink()).to.exist;
        expect(reportsPage.getImpressionsCheckBox()).to.exist;
        expect(reportsPage.getClicksCheckBox()).to.exist;
        expect(reportsPage.getConversionsCheckBox()).to.exist;
        reportsPage.clickDSPCampaignType();
        expect(reportsPage.getSSPCampaignType()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should exit report create modal', function(done) {
        reportsPage.clickExitReportModal();
        driver.sleep(driverTimeOut).then(() => done());
    });
});
